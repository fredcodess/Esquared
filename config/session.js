const expressSession = require("express-session");
const mongoDbStore = require("connect-mongodb-session");

function createSessionStore() {
  const MongoDBStore = mongoDbStore(expressSession);

  const store = new MongoDBStore({
    uri: "mongodb://localhost:27017",
    databaseName: "e-squared",
    collection: "sessions",
  });

  return store;
}

function createSessionConfig() {
  return {
    secret: "super-secrettt",
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookle: {
      maxAge: 2 * 24 * 60 * 1000,
    },
  };
}

module.exports = createSessionConfig;
