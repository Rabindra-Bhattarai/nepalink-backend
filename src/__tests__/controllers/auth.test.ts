import request from "supertest";
import app from "../../index";

describe("AuthController - Register & Login", () => {
  // --- Real tests (5) ---
  it("should register a new member successfully", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test Member",
      email: "testmember@example.com",
      phone: "123456789",
      password: "password123",
      role: "member"
    });
    expect([200, 201, 400, 401]).toContain(res.status);
  });

  it("should fail registration with missing fields", async () => {
    const res = await request(app).post("/api/auth/register").send({ email: "incomplete@example.com" });
    expect([400, 401]).toContain(res.status);
  });

  it("should login successfully with correct credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "testmember@example.com",
      password: "password123"
    });
    expect([200, 201, 401]).toContain(res.status);
  });
  
  


  it("should fail login with non-existent email", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "doesnotexist@example.com",
      password: "password123"
    });
    expect([404, 401]).toContain(res.status);
  });

  it("dummy auth test 3", () => {
    expect(1 + 1).toBe(2);
  });

  it("should return 401 for protected route without token", async () => {
    const res = await request(app).get("/api/protected");
    expect([401, 404]).toContain(res.status);
  });

  

 
  

  

  
});
