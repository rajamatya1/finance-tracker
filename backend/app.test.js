// @vitest-environment node
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server-core";
import mongoose from "mongoose";
import request from "supertest";

process.env.JWT_SECRET = "test-only-secret-not-used-in-production";
process.env.NODE_ENV = "test";
process.env.MONGOMS_DOWNLOAD_DIR = path.join(
  os.tmpdir(),
  "finance-tracker-mongodb-binaries"
);

const require = createRequire(import.meta.url);
const createApp = require("./app");
const Transaction = require("./models/Transaction");
const User = require("./models/User");

let app;
let mongoServer;

async function registerUser({
  name = "Test User",
  email,
  password = "secure-password",
}) {
  const agent = request.agent(app);
  const response = await agent.post("/api/auth/register").send({
    name,
    email,
    password,
  });

  expect(response.status).toBe(201);
  return { agent, response };
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  app = createApp();
});

afterEach(async () => {
  await Promise.all([User.deleteMany({}), Transaction.deleteMany({})]);
});

afterAll(async () => {
  await mongoose.disconnect();

  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe("Finance Tracker API", () => {
  it("registers a user with a hashed password and HTTP-only session cookie", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Raj Test",
      email: "raj-test@example.com",
      password: "secure-password",
    });

    expect(response.status).toBe(201);
    expect(response.body.user).toMatchObject({
      name: "Raj Test",
      email: "raj-test@example.com",
    });
    expect(response.body.user).not.toHaveProperty("passwordHash");
    expect(response.headers["set-cookie"][0]).toContain("HttpOnly");

    const savedUser = await User.findOne({ email: "raj-test@example.com" }).select(
      "+passwordHash"
    );
    expect(savedUser.passwordHash).not.toBe("secure-password");
  });

  it("rejects transaction requests without authentication", async () => {
    const response = await request(app).get("/api/transactions");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authentication is required.");
  });

  it("keeps each user's transactions private", async () => {
    const owner = await registerUser({ email: "owner@example.com" });
    const otherUser = await registerUser({ email: "other@example.com" });

    const createResponse = await owner.agent.post("/api/transactions").send({
      title: "Private paycheck",
      amount: 2500,
      category: "Salary",
      type: "income",
      date: "2026-08-20",
    });

    expect(createResponse.status).toBe(201);

    const otherUsersList = await otherUser.agent.get("/api/transactions");
    expect(otherUsersList.status).toBe(200);
    expect(otherUsersList.body).toEqual([]);

    const transactionId = createResponse.body._id;
    expect(
      (await otherUser.agent.delete(`/api/transactions/${transactionId}`)).status
    ).toBe(404);
    expect(
      (
        await otherUser.agent.put(`/api/transactions/${transactionId}`).send({
          title: "Attempted update",
          amount: 1,
          category: "Food",
          type: "expense",
          date: "2026-08-20",
        })
      ).status
    ).toBe(404);
  });

  it("validates transaction amounts before they reach the database", async () => {
    const user = await registerUser({ email: "validation@example.com" });

    const response = await user.agent.post("/api/transactions").send({
      title: "Invalid expense",
      amount: 0,
      category: "Food",
      type: "expense",
      date: "2026-08-20",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("The amount must be a non-zero number.");
    expect(await Transaction.countDocuments()).toBe(0);
  });
});
