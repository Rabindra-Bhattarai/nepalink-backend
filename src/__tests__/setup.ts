import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;

jest.setTimeout(30000); // increase timeout for DB-heavy tests

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // expose URI globally so connectDatabase can use it
  (global as any).__MONGO_URI__ = uri;
  process.env.NODE_ENV = "test";

  await mongoose.connect(uri, { dbName: "nepalink_test" });
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
