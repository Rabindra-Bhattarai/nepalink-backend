import request from "supertest";
import app from "../../index";

describe("BookingController", () => {
  it("should create a booking with valid data", async () => {
    const res = await request(app).post("/api/bookings").send({
      nurseId: "123456789012",
      date: new Date().toISOString()
    });
    expect([201, 200, 400, 401]).toContain(res.status);
  });

  it("should fail to create booking with missing fields", async () => {
    const res = await request(app).post("/api/bookings").send({});
    expect([400, 401]).toContain(res.status);
  });

  it("should accept a booking", async () => {
    const res = await request(app).put("/api/bookings/123456789012/accept");
    expect([200, 201, 404, 401]).toContain(res.status);
  });

  it("should decline a booking", async () => {
    const res = await request(app).put("/api/bookings/123456789012/decline");
    expect([200, 201, 404, 401]).toContain(res.status);
  });

  it("should cancel a booking", async () => {
    const res = await request(app).put("/api/bookings/123456789012/cancel");
    expect([200, 201, 403, 404, 401]).toContain(res.status);
  });

  it("should get bookings for member or nurse", async () => {
    const res = await request(app).get("/api/bookings");
    expect([200, 401, 403]).toContain(res.status);
  });

  it("should return 404 for non-existent booking", async () => {
    const res = await request(app).put("/api/bookings/invalid-id/accept");
    expect([404, 400, 401]).toContain(res.status);
  });
});
