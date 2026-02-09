import request from "supertest";
import app from "../index";

describe("Auth Integration Tests", () => {
  const testUser = {
    name: "Test User",
    email: "testuser@example.com",
    phone: "9800000001",
    password: "Pass123!"
  };

  // Ensure user exists before each test
  beforeEach(async () => {
    await request(app)
      .post("/api/auth/register")
      .send(testUser);
  });

  it("should register a new user successfully", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Another User",
        email: "another@example.com",
        phone: "9800000002",
        password: "Pass123!"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("email", "another@example.com");
  });

  it("should fail to register with missing fields", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "invalid@example.com" });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should login successfully with correct credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("token");
  });

  it("should fail login with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: "WrongPass!" });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should return current user with valid token", async () => {
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password });

    const token = login.body.token;

    const res = await request(app)
      .get("/api/auth/me")
      .set("Cookie", [`auth_token=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("email", testUser.email);
  });

  it("should fail to get current user without token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
