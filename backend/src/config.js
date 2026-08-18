const path = require('path');

module.exports = {
  port: process.env.PORT || 4001,
  // Dev-only default so the project runs out of the box; override via env var for any real deployment.
  jwtSecret: process.env.JWT_SECRET || 'studybuddy-dev-secret-change-in-production',
  dbPath: process.env.DB_PATH || path.join(__dirname, '..', 'data', 'mongo'),
};
