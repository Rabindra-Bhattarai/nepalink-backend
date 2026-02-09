import request from "supertest";
import app from "../index";
import path from "path";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

describe("User Routes Integration", () => {
  let userId: string;
  const adminToken = jwt.sign({ role: "admin" }, JWT_SECRET);

  beforeEach(async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "UserTest",
        email: "user@example.com",
        phone: "9800000013",
        password: "secret123",
      });
    userId = res.body.data._id;
  });

  it("gets user by ID (admin route)", async () => {
    const res = await request(app)
      .get(`/api/admin/users/${userId}`)
      .set("Cookie", [`auth_token=${adminToken}`]);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe("user@example.com");
  });

  it("fails get user with invalid ID format", async () => {
    const res = await request(app)
      .get("/api/admin/users/invalidid")
      .set("Cookie", [`auth_token=${adminToken}`]);
    expect(res.status).toBe(404);
  });

  it("fails get non-existent user", async () => {
    const res = await request(app)
      .get("/api/admin/users/507f1f77bcf86cd799439011")
      .set("Cookie", [`auth_token=${adminToken}`]);
    expect(res.status).toBe(404);
  });

  it("updates profile picture with valid image", async () => {
    const res = await request(app)
      .post(`/api/users/${userId}/upload`)
      .attach("photo", path.resolve(__dirname, "fixtures/test.jpeg"));
    expect(res.status).toBe(200);
  });

  it("fails update profile picture with no file", async () => {
    const res = await request(app).post(`/api/users/${userId}/upload`);
    expect(res.status).toBe(400);
  });

  it("fails update profile picture with invalid file type", async () => {
    const res = await request(app)
      .post(`/api/users/${userId}/upload`)
      .attach("photo", path.resolve(__dirname, "fixtures/test.pdf"));
    expect(res.status).toBe(400);
  });
});
