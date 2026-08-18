const fs = require('fs');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const config = require('./config');

let mongoServer;

async function connectDB() {
  fs.mkdirSync(config.dbPath, { recursive: true });

  // Runs a real local MongoDB instance with data persisted to disk across restarts,
  // so no separate MongoDB install/Docker container is required for local dev.
  mongoServer = await MongoMemoryServer.create({
    instance: { dbPath: config.dbPath, storageEngine: 'wiredTiger' },
  });

  const uri = mongoServer.getUri('studybuddy');
  await mongoose.connect(uri);
  console.log('Connected to MongoDB at', uri);
}

async function disconnectDB() {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
}

module.exports = { connectDB, disconnectDB };
