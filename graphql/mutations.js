"use strict";
const connectDB = require("./db");
const { ObjectID } = require("mongodb");

module.exports = {
  newDeveloper: async (root, { input }) => {
    const defaults = {
      description: "",
      phone_area: "",
      phone: "",
      social_fb: "",
      social_ig: "",
      social_linkedin: "",
      img_logo: "",
      img_header: "",
      plan: "",
      cc_token: "",
      admin_id: "",
      sellers: []
    };
    const nuevaDesarrolladora = Object.assign(defaults, input);
    let db;
    let desarrolladora;

    try {
      db = await connectDB();
      nuevaDesarrolladora = await db
        .collection("desarrolladoras")
        .insertOne(nuevaDesarrolladora);
      nuevaDesarrolladora._id = desarrolladora.insertedId;
    } catch (error) {}
    return nuevaDesarrolladora;
  },

  newSeller: async (root, { input }) => {
    const defaults = {
      phone: "",
      pic: "",
      job: "",
      blocked: false
    };
    const nuevoVendedor = Object.assign(defaults, input);
    let db;
    let vendedor;
    try {
      db = await connectDB();
      nuevoVendedor = await db
        .collection("vendedores")
        .insertOne(nuevoVendedor);
      nuevoVendedor._id = vendedor.insertedId;
    } catch (error) {}
    return nuevoVendedor;
  },
  addSellerToDeveloper: async (root, { developerID, sellerID }) => {
    let db;
    let desarrolladora;
    let vendedor;
    try {
      db = await connectDB();
      //buscar Desarrolladora
      desarrolladora = await db
        .collection("desarrolladoras")
        .findOne({ _id: ObjectID(developerID) });
      //buscar Vendedor  
      vendedor = await db
        .collection("vendedores")
        .findOne({ _id: ObjectID(sellerID) });
      if (!desarrolladora || !vendedor) {
        throw new Error("La desarrolladora o el Vendedor no existen.");
    }
      await db
        .collection("desarrolladoras")
        .updateOne(
          { _id: ObjectID(developerID) },
          { $addToSet: { sellers: ObjectID(sellerID) } }
        );
    } catch (error) {
        console.log(error)
    }
    return desarrolladora;
  }
};
