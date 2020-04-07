"use strict";
const { MongoClient } = require("mongodb");

const { DB_USER, DB_PASSWD, DB_HOST, DB_PORT, DB_NAME } = process.env;

const mongoUrl = `mongodb+srv://${DB_USER}:${DB_PASSWD}@${DB_HOST}/test?retryWrites=true&w=majority`;

/*
const mongoUrl = `mongodb://localhost:27017/api_flattlo`;
*/
let connection;

async function connectDB() {
  if (connection) return connection;

  let client;
  try {
    client = await MongoClient.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      poolSize: 10
    });
    connection = client.db(DB_NAME);
  } catch (error) {
    console.error("Could not connect to db", mongoUrl, error);
    process.exit(1);
  }

  return connection;
}

module.exports = connectDB;
