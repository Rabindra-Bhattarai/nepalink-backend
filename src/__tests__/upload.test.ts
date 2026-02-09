import request from "supertest";
import app from "../index";
import path from "path";

describe("Upload Routes Integration", () => {
  let userId: string;

  beforeEach(async () => {
    // Create a real user before testing uploads
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "UploadUser",
        email: "upload@example.com",
        phone: "9800000020",
        password: "secret123",
      });
    userId = res.body.data._id;
  });

  it("uploads JPEG", async () => {
    const res = await request(app)
      .post(`/api/users/${userId}/upload`)
      .attach("photo", path.resolve(__dirname, "fixtures/test.jpeg"));
    expect(res.status).toBe(200);
  });

  it("uploads PNG", async () => {
    const res = await request(app)
      .post(`/api/users/${userId}/upload`)
      .attach("photo", path.resolve(__dirname, "fixtures/test.png"));
    expect(res.status).toBe(200);
  });

  it("uploads GIF", async () => {
    const res = await request(app)
      .post(`/api/users/${userId}/upload`)
      .attach("photo", path.resolve(__dirname, "fixtures/test.gif"));
    expect(res.status).toBe(200);
  });

  it("rejects >5MB file", async () => {
    const bigBuffer = Buffer.alloc(6 * 1024 * 1024); // 6MB
    const res = await request(app)
      .post(`/api/users/${userId}/upload`)
      .attach("photo", bigBuffer, "big.png");
    expect(res.status).toBe(500); // multer error
  });

  it("rejects unsupported type", async () => {
    const res = await request(app)
      .post(`/api/users/${userId}/upload`)
      .attach("photo", path.resolve(__dirname, "fixtures/test.pdf"));
    expect(res.status).toBe(400);
  });
});
