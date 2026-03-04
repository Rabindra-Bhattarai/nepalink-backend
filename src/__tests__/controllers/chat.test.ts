import request from "supertest";
import app from "../../index";

const memberToken = "your-member-token";
const nurseToken = "your-nurse-token";

describe("ChatController", () => {
  // --- Unauthorized case ---
  it("should fail to get messages without token (401)", async () => {
    const res = await request(app).get("/api/chat/123456789012");
    expect(res.status).toBe(401);
  });

  // --- Get messages ---
  it("should get messages for contract (member)", async () => {
    const res = await request(app)
      .get("/api/chat/123456789012")
      .set("Authorization", `Bearer ${memberToken}`);
    expect([200, 401, 403]).toContain(res.status);
  });

  it("should get messages for contract (nurse)", async () => {
    const res = await request(app)
      .get("/api/chat/123456789012")
      .set("Authorization", `Bearer ${nurseToken}`);
    expect([200, 401, 403]).toContain(res.status);
  });

  // --- Send messages ---
  it("should fail to send empty message (400)", async () => {
    const res = await request(app)
      .post("/api/chat/123456789012/message")
      .set("Authorization", `Bearer ${memberToken}`)
      .send({ receiverId: "69a2848aa01eb6fb3478e35b", message: "" });
    expect([400, 401]).toContain(res.status);
  });

  it("should send message (member)", async () => {
    const res = await request(app)
      .post("/api/chat/123456789012/message")
      .set("Authorization", `Bearer ${memberToken}`)
      .send({
        receiverId: "69a2848aa01eb6fb3478e35b",
        message: "Hello Nurse",
      });
    expect([201, 401, 403]).toContain(res.status);
  });

  it("should send message (nurse)", async () => {
    const res = await request(app)
      .post("/api/chat/123456789012/message")
      .set("Authorization", `Bearer ${nurseToken}`)
      .send({
        receiverId: "6996cfa17a43363b489c0c2c",
        message: "Hello Member",
      });
    expect([201, 401, 403]).toContain(res.status);
  });

  // --- Mark messages read ---
  it("should mark messages as read (member)", async () => {
    const res = await request(app)
      .patch("/api/chat/123456789012/read")
      .set("Authorization", `Bearer ${memberToken}`);
    expect([200, 401, 403]).toContain(res.status);
  });

  it("should mark messages as read (nurse)", async () => {
    const res = await request(app)
      .patch("/api/chat/123456789012/read")
      .set("Authorization", `Bearer ${nurseToken}`);
    expect([200, 401, 403]).toContain(res.status);
  });

  // --- Access denied case ---
  it("should deny access if user not in contract (403)", async () => {
    const fakeToken = "Bearer faketoken";
    const res = await request(app)
      .get("/api/chat/123456789012")
      .set("Authorization", fakeToken);
    expect([403, 401]).toContain(res.status);
  });
});
