import request from "supertest";
import app from "../index";
import { UserModel } from "../models/user.model";

describe("Auth Routes Integration", () => {
  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  it("registers a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User", email: "test@example.com", phone: "9800000000", password: "secret123"
    });
    expect(res.status).toBe(201);
    expect(res.body.data.email).toBe("test@example.com");
  });

  it("fails register with missing fields", async () => {
    const res = await request(app).post("/api/auth/register").send({ email: "missing@example.com" });
    expect(res.status).toBe(400);
  });

  it("rejects duplicate email", async () => {
    await request(app).post("/api/auth/register").send({ name: "A", email: "dup@example.com", phone: "9800000001", password: "secret123" });
    const res = await request(app).post("/api/auth/register").send({ name: "B", email: "dup@example.com", phone: "9800000002", password: "secret123" });
    expect(res.status).toBe(403);
  });

  it("rejects duplicate phone", async () => {
    await request(app).post("/api/auth/register").send({ name: "A", email: "phone1@example.com", phone: "9800000003", password: "secret123" });
    const res = await request(app).post("/api/auth/register").send({ name: "B", email: "phone2@example.com", phone: "9800000003", password: "secret123" });
    expect(res.status).toBe(403);
  });

  it("logs in with correct credentials", async () => {
    await request(app).post("/api/auth/register").send({ name: "Login", email: "login@example.com", phone: "9800000004", password: "secret123" });
    const res = await request(app).post("/api/auth/login").send({ email: "login@example.com", password: "secret123" });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("rejects wrong password", async () => {
    await request(app).post("/api/auth/register").send({ name: "Wrong", email: "wrong@example.com", phone: "9800000005", password: "secret123" });
    const res = await request(app).post("/api/auth/login").send({ email: "wrong@example.com", password: "badpass" });
    expect(res.status).toBe(401);
  });

  it("rejects non-existent email", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "noexist@example.com", password: "secret123" });
    expect(res.status).toBe(401);
  });

  it("returns /me with valid token", async () => {
    await request(app).post("/api/auth/register").send({ name: "Me", email: "me@example.com", phone: "9800000006", password: "secret123" });
    const loginRes = await request(app).post("/api/auth/login").send({ email: "me@example.com", password: "secret123" });
    const cookie = loginRes.headers["set-cookie"][0];
    const res = await request(app).get("/api/auth/me").set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe("me@example.com");
  });

  it("rejects /me with invalid token", async () => {
    const res = await request(app).get("/api/auth/me").set("Cookie", ["auth_token=invalid"]);
    expect(res.status).toBe(401);
  });

  it("rejects /me with no token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });
});
