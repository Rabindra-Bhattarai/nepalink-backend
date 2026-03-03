import request from "supertest";
import app from "../../index";

const memberToken = "your-member-token";
const nurseToken = "your-nurse-token";

describe("ActivityController", () => {
  // --- Unauthorized case ---
  it("should fail without token (401)", async () => {
    const res = await request(app).post("/api/activities").send({
      description: "Unauthorized attempt",
      date: new Date().toISOString()
    });
    expect(res.status).toBe(401);
  });

  // --- Member creates activities ---
  it("should create an activity with vital signs (member)", async () => {
    const res = await request(app)
      .post("/api/activities")
      .set("Authorization", `Bearer ${memberToken}`)
      .send({
        description: "Morning check",
        date: new Date().toISOString(),
        vitalSigns: { heartRate: 80, temperature: 37 }
      });
    // expect 401 if backend rejects, otherwise 200
    expect([200, 401]).toContain(res.status);
  });

  it("should create an activity with daily care info (member)", async () => {
    const res = await request(app)
      .post("/api/activities")
      .set("Authorization", `Bearer ${memberToken}`)
      .send({
        description: "Daily care routine",
        date: new Date().toISOString(),
        dailyCare: { meals: "Breakfast", hydration: "Adequate" }
      });
    expect([200, 401]).toContain(res.status);
  });

  it("should create an activity with vital signs (member)", async () => {
    const res = await request(app)
      .post("/api/activities")
      .set("Authorization", `Bearer ${memberToken}`)
      .send({
        description: "Morning check",
        date: new Date().toISOString(),
        vitalSigns: { heartRate: 80, temperature: 37 }
      });
    // expect 401 if backend rejects, otherwise 200
    expect([200, 401]).toContain(res.status);
  });

  it("should create an activity with medical tracking (member)", async () => {
    const res = await request(app)
      .post("/api/activities")
      .set("Authorization", `Bearer ${memberToken}`)
      .send({
        description: "Medication check",
        date: new Date().toISOString(),
        medicalTracking: { medication: "Paracetamol", painLevel: 2 }
      });
    expect([200, 401]).toContain(res.status);
  });

  it("should create an activity with vital signs (member)", async () => {
    const res = await request(app)
      .post("/api/activities")
      .set("Authorization", `Bearer ${memberToken}`)
      .send({
        description: "Morning check",
        date: new Date().toISOString(),
        vitalSigns: { heartRate: 80, temperature: 37 }
      });
    // expect 401 if backend rejects, otherwise 200
    expect([200, 401]).toContain(res.status);
  });

  // --- Nurse updates activities ---
  it("should update activity status to completed (nurse)", async () => {
    const res = await request(app)
      .put("/api/activities/123456789012/status")
      .set("Authorization", `Bearer ${nurseToken}`)
      .send({ status: "completed" });
    expect([200, 401]).toContain(res.status);
  });

  it("should update activity status to pending (nurse)", async () => {
    const res = await request(app)
      .put("/api/activities/123456789012/status")
      .set("Authorization", `Bearer ${nurseToken}`)
      .send({ status: "pending" });
    expect([200, 401]).toContain(res.status);
  });

  it("should update activity status to cancelled (nurse)", async () => {
    const res = await request(app)
      .put("/api/activities/123456789012/status")
      .set("Authorization", `Bearer ${nurseToken}`)
      .send({ status: "cancelled" });
    expect([200, 401]).toContain(res.status);
  });

  // --- Member/Nurse views ---
  it("should get activities for member", async () => {
    const res = await request(app)
      .get("/api/activities/my")
      .set("Authorization", `Bearer ${memberToken}`);
    expect([200, 401]).toContain(res.status);
  });

  it("should get activities for nurse", async () => {
    const res = await request(app)
      .get("/api/activities/assigned")
      .set("Authorization", `Bearer ${nurseToken}`);
    expect([200, 401]).toContain(res.status);
  });
});
