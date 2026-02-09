import request from "supertest";
import app from "../index";
import { UserModel } from "../models/user.model";
import { ResetTokenModel } from "../models/reset-token.model";

describe("Password Routes Integration", () => {
  let userId: string;

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await ResetTokenModel.deleteMany({});
    const user = await UserModel.create({ name: "Reset", email: "reset@example.com", phone: "9800000007", password: "secret123" });
    userId = user._id.toString();
  });

  it("sends reset email", async () => {
    const res = await request(app).post("/api/auth/forgot-password").send({ email: "reset@example.com" });
    expect(res.status).toBe(200);
  });

  it("fails reset email for non-existent user", async () => {
    const res = await request(app).post("/api/auth/forgot-password").send({ email: "no@example.com" });
    expect(res.status).toBe(404);
  });

  it("resets password with valid token", async () => {
    const tokenDoc = await ResetTokenModel.create({ userId, token: "validtoken", expiresAt: new Date(Date.now() + 3600000) });
    const res = await request(app).post(`/api/auth/reset-password/${tokenDoc.token}`).send({ password: "newpass123" });
    expect(res.status).toBe(200);
  });

  it("rejects expired token", async () => {
    const tokenDoc = await ResetTokenModel.create({ userId, token: "expiredtoken", expiresAt: new Date(Date.now() - 1000) });
    const res = await request(app).post(`/api/auth/reset-password/${tokenDoc.token}`).send({ password: "newpass123" });
    expect(res.status).toBe(400);
  });

  it("rejects invalid token", async () => {
    const res = await request(app).post("/api/auth/reset-password/invalidtoken").send({ password: "newpass123" });
    expect(res.status).toBe(400);
  });

  it("rejects reset for deleted user", async () => {
    const user = await UserModel.create({ name: "Del", email: "del@example.com", phone: "9800000008", password: "secret123" });
    const tokenDoc = await ResetTokenModel.create({ userId: user._id, token: "deluser", expiresAt: new Date(Date.now() + 3600000) });
    await UserModel.deleteOne({ _id: user._id });
    const res = await request(app).post(`/api/auth/reset-password/${tokenDoc.token}`).send({ password: "newpass123" });
    expect(res.status).toBe(404);
  });
});
