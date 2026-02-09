import request from "supertest";
import app from "../index";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

describe("Admin Routes Integration", () => {
  const adminToken = jwt.sign({ role: "admin" }, JWT_SECRET);

  it("creates user as admin", async () => {
    const res = await request(app).post("/api/admin/users")
      .set("Cookie", [`auth_token=${adminToken}`])
      .send({ name: "AdminCreated", email: "adminuser@example.com", phone: "9800000009", password: "secret123", role: "member" });
    expect(res.status).toBe(201);
  });

  it("fails create user missing fields", async () => {
    const res = await request(app).post("/api/admin/users")
      .set("Cookie", [`auth_token=${adminToken}`])
      .send({ email: "missing@example.com" });
    expect(res.status).toBe(400);
  });

  it("gets all users with pagination", async () => {
    const res = await request(app).get("/api/admin/users?page=1&limit=5")
      .set("Cookie", [`auth_token=${adminToken}`]);
    expect(res.status).toBe(200);
  });

  it("filters users by role", async () => {
    const res = await request(app).get("/api/admin/users?role=member")
      .set("Cookie", [`auth_token=${adminToken}`]);
    expect(res.status).toBe(200);
  });

  it("filters users by name", async () => {
    const res = await request(app).get("/api/admin/users?name=Admin")
      .set("Cookie", [`auth_token=${adminToken}`]);
    expect(res.status).toBe(200);
  });

  it("gets single user", async () => {
    const createRes = await request(app).post("/api/admin/users")
      .set("Cookie", [`auth_token=${adminToken}`])
      .send({ name: "Single", email: "single@example.com", phone: "9800000010", password: "secret123", role: "nurse" });
    const id = createRes.body.data._id;
    const res = await request(app).get(`/api/admin/users/${id}`).set("Cookie", [`auth_token=${adminToken}`]);
    expect(res.status).toBe(200);
  });

  it("fails get non-existent user", async () => {
    const res = await request(app).get("/api/admin/users/507f1f77bcf86cd799439011").set("Cookie", [`auth_token=${adminToken}`]);
    expect(res.status).toBe(404);
  });

  it("updates user", async () => {
    const createRes = await request(app).post("/api/admin/users")
      .set("Cookie", [`auth_token=${adminToken}`])
      .send({ name: "Update", email: "update@example.com", phone: "9800000011", password: "secret123", role: "member" });
    const id = createRes.body.data._id;
    const res = await request(app).put(`/api/admin/users/${id}`).set("Cookie", [`auth_token=${adminToken}`]).send({ name: "Updated Name" });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Updated Name");
  });

  it("deletes user", async () => {
    const createRes = await request(app).post("/api/admin/users")
      .set("Cookie", [`auth_token=${adminToken}`])
      .send({ name: "Delete", email: "delete@example.com", phone: "9800000012", password: "secret123", role: "member" });
    const id = createRes.body.data._id;
    const res = await request(app).delete(`/api/admin/users/${id}`).set("Cookie", [`auth_token=${adminToken}`]);
    expect(res.status).toBe(200);
  });

  it("blocks non-admin access", async () => {
    const userToken = jwt.sign({ role: "member" }, JWT_SECRET);
    const res = await request(app).get("/api/admin/users").set("Cookie", [`auth_token=${userToken}`]);
    expect(res.status).toBe(403);
  });
});
