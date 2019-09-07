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
        .collection("desarrolladoras")
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
        .collection("desarrolladoras")
        .findOne({ _id: ObjectID(id) });
    } catch (error) {
      console.log(error);
    }
    return desarrolladora;
  },
  getAllSellers: async () =>{
    let db;
    let vendedores = [];
    try {
      db = await connectDB();
      vendedores = await db
        .collection("vendedores")
        .find()
        .toArray();
    } catch (error) {
      console.log(error);
    }
    return vendedores;
  },
  getSeller: async (root, { id }) => {
    let db;
    let vendedor;
    try {
      db = await connectDB();
      vendedor = await db
        .collection("vendedores")
        .findOne({ _id: ObjectID(id) });
    } catch (error) {
      console.log(error);
    }
    return vendedor;
  },
};
