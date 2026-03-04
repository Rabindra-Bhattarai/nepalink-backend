import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;

// Increase Jest timeout globally for this test environment
jest.setTimeout(30000); // 30 seconds

beforeAll(async () => {
  console.time("MongoMemoryServer startup");

  // Create MongoMemoryServer with default options
  mongoServer = await MongoMemoryServer.create();

  console.timeEnd("MongoMemoryServer startup");

  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { dbName: "testdb" });
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
});
