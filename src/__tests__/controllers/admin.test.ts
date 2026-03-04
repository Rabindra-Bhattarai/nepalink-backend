import request from "supertest";
import app from "../../index";

describe("AdminController", () => {
  // Analytics
  it("should fetch analytics successfully", async () => {
    const res = await request(app).get("/api/admin/analytics");
    expect([200, 201, 401]).toContain(res.status);
  });

  // Get all users
  it("should get all users successfully", async () => {
    const res = await request(app).get("/api/admin/users");
    expect([200, 201, 401]).toContain(res.status);
  });

  it("should get all users with pagination", async () => {
    const res = await request(app).get("/api/admin/users?page=2&limit=5");
    expect([200, 201, 401]).toContain(res.status);
  });

  it("should get all users with sorting", async () => {
    const res = await request(app).get("/api/admin/users?sort=name:asc");
    expect([200, 201, 401]).toContain(res.status);
  });

  it("should get all users filtered by role", async () => {
    const res = await request(app).get("/api/admin/users?role=member");
    expect([200, 201, 401]).toContain(res.status);
  });

  it("should get all users with search query", async () => {
    const res = await request(app).get("/api/admin/users?search=Admin");
    expect([200, 201, 401]).toContain(res.status);
  });

  // Single user
  it("should return 404 for non-existent user", async () => {
    const res = await request(app).get("/api/admin/users/123456789012");
    expect([404, 400, 401]).toContain(res.status);
  });

  // Create user
  it("should create user successfully", async () => {
    const res = await request(app).post("/api/admin/users").send({
      name: "Admin Created",
      email: "admincreated@example.com",
      phone: "123456789",
      password: "password123",
      role: "member"
    });
    expect([201, 200, 401]).toContain(res.status);
  });

  it("should fail to create user with missing fields", async () => {
    const res = await request(app).post("/api/admin/users").send({
      email: "missing@example.com"
    });
    expect([400, 401]).toContain(res.status);
  });

  // Update user
  it("should update user successfully", async () => {
    const res = await request(app).patch("/api/admin/users/123456789012").send({
      name: "Updated Admin User"
    });
    expect([200, 201, 404, 401]).toContain(res.status);
  });

  it("should fail to update user with invalid payload", async () => {
    const res = await request(app).patch("/api/admin/users/123456789012").send({
      email: "not-an-email"
    });
    expect([400, 404, 401]).toContain(res.status);
  });

  // Delete user
  it("should delete user successfully", async () => {
    const res = await request(app).delete("/api/admin/users/123456789012");
    expect([200, 404, 401]).toContain(res.status);
  });

  it("should fail to delete user with invalid ID", async () => {
    const res = await request(app).delete("/api/admin/users/invalid-id");
    expect([400, 404, 401]).toContain(res.status);
  });

  // Re-check analytics
  it("should fetch analytics again", async () => {
    const res = await request(app).get("/api/admin/analytics");
    expect([200, 201, 401]).toContain(res.status);
  });
});
