"use strict";
const connectDB = require("./db");
const { ObjectID } = require("mongodb");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
      cc_token: "",
      admins_team: [],
      sellers_team: []
    };
    const nuevaDesarrolladora = Object.assign(defaults, input);
    let db;
    let desarrolladora;

    try {
      db = await connectDB();
      nuevaDesarrolladora = await db
        .collection("realStateDevelopers")
        .insertOne(nuevaDesarrolladora);
      nuevaDesarrolladora._id = desarrolladora.insertedId;
    } catch (error) {}
    return nuevaDesarrolladora;
  },

  newUser: async (root, { email, password, first_name, last_name, company, company_id, phone}) => {
    const hashPassword = await bcrypt.hash(password,10)
    const newUser = {
      first_name,
      last_name,
      email,
      password: hashPassword,
      company,
      company_id,
      phone,
      pic : "",
      roll: undefined,
      blocked: false
    };
    const nuevoUsuario = Object.assign(newUser);
    let db;
    let usuario;
    try {
      db = await connectDB();
      nuevoUsuario = await db
        .collection("users")
        .insertOne(nuevoUsuario);
      nuevoUsuario._id = usuario.insertedId;
    } catch (error) {}
    return nuevoUsuario;
  },
  addUserToSellersTeam: async (root, { developerID, userID }) => {
    let db;
    let desarrolladora;
    let usuario;
    try {
      db = await connectDB();
      //buscar Desarrolladora
      desarrolladora = await db
        .collection("realStateDevelopers")
        .findOne({ _id: ObjectID(developerID) });
      //buscar Vendedor  
      usuario = await db
        .collection("users")
        .findOne({ _id: ObjectID(userID) });
      if (!desarrolladora || !usuario) {
        throw new Error("La desarrolladora o el Vendedor no existen.");
    }
      await db
        .collection("realStateDevelopers")
        .updateOne(
          { _id: ObjectID(developerID) },
          { $addToSet: { sellers_team: ObjectID(userID) } }
        );
    } catch (error) {
        console.log(error)
    }
    return desarrolladora;
  },
  login: async (root, { username, password }) => {
     let db;
     let user;
     try {
      db = await connectDB();
      user = await db
      .collection("users")
      .findOne({ email: username });
      if (!user) {
        throw new Error('Invalid Login, ErrM01')
      }
    
      const isEqual = await bcrypt.compare(password, user.password)
    
      if (!isEqual ) {
        throw new Error('Invalid Login, ErrM02')
      }
     } catch (error) {
       throw error
     }
     const token = jwt.sign(
      {
        userID: user.id,
        email: user.email,
      },
      '67D89823E8A7382CC78D5285B1C42',
      {
        expiresIn: '12h', // token will expire in 30days
      },
    )
    return {
      token,
      user,
    }
        
  },
  updataDeveloperProfile: async(root, {developerID, objectField, value}) =>{
    let db
    let updateData
    try {
      db = await connectDB();
      updateData = await db
      .collection("realStateDevelopers")
      .updateOne({ _id: ObjectID(developerID) }
      , {$set:{[objectField]: value}});
 
    } catch (error) {
      throw error
    }return {
      objectField,
      value
    }},

    updateUserProfile: async(root, {ID, objectField, value}) =>{
      let db
      let updateData
      try {
        db = await connectDB();
        updateData = await db
        .collection("users")
        .updateOne({ _id: ObjectID(ID) }
        , {$set:{[objectField]: value}});
   
      } catch (error) {
        throw error
      }return {
        objectField,
        value
      }},
  
};
