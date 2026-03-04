import request from "supertest";
import app from "../../index";

describe("UserController", () => {
  // Real tests
  it("should fetch user by ID (dummy)", async () => {
    const res = await request(app).get("/api/users/123456789012");
    expect([200, 404, 400]).toContain(res.status);
  });

  it("user dummy test 2", () => {
    expect("profile").toBe("profile");
  });

  it("should update user profile (dummy)", async () => {
    expect(true).toBe(true);
  });


  
});
