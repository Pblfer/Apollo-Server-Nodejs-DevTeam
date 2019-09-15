"use strict";
const connectDB = require("./db");
const { ObjectID } = require("mongodb");

module.exports = {
  getAllDevelopers: async () => {
    let db;
    let desarrolladoras = [];
    try {
      db = await connectDB();
      desarrolladoras = await db
        .collection("realStateDevelopers")
        .find()
        .toArray();
    } catch (error) {
      console.log(error);
    }
    return desarrolladoras;
  },
  getDeveloper: async (root, { id }) => {
    let db;
    let desarrolladora;
    try {
      db = await connectDB();
      desarrolladora = await db
        .collection("realStateDevelopers")
        .findOne({ _id: ObjectID(id) });
    } catch (error) {
      console.log(error);
    }
    return desarrolladora;
  },
  getAllUsers: async () =>{
    let db;
    let usuarios = [];
    try {
      db = await connectDB();
      usuarios = await db
        .collection("users")
        .find()
        .toArray();
    } catch (error) {
      console.log(error);
    }
    return usuarios;
  },
  getUser: async (root, { id }) => {
    let db;
    let usuario;
    try {
      db = await connectDB();
      usuario = await db
        .collection("users")
        .findOne({ _id: ObjectID(id) });
    } catch (error) {
      console.log(error);
    }
    return usuario;
  },
};
