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
      img_header: "https://firebasestorage.googleapis.com/v0/b/cotizador-conversion.appspot.com/o/stockImages%2Fcover.jpg?alt=media&token=67860976-2d6d-4f5b-9b40-9cdc4873d24a",
      cc_token: "",
      proyects:[],
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

  newUser: async (root, { email, password, first_name, last_name, company, company_id, phone, roll, blocked}) => {
    const hashPassword = await bcrypt.hash(password,10)
    const newUser = {
      first_name,
      last_name,
      email,
      password: hashPassword,
      company,
      company_id,
      phone,
      pic : "https://firebasestorage.googleapis.com/v0/b/cotizador-conversion.appspot.com/o/stockImages%2FuserDefaultPic.jpg?alt=media&token=7bacc009-b998-4abf-8722-79a5dae8f6c8",
      roll,
      blocked,
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

  newDiscount: async (root, {name, company_id, proyect_id, discount_amount, active}) =>{
    let db
    let discount
    const newDiscount = {
      name,
      company_id,
      proyect_id,
      discount_amount,
      active
    }
    const ingresarDescuento = Object.assign(newDiscount)
    try {
      db = await connectDB();
      ingresarDescuento = await db
      .collection("discounts")
      .insertOne(ingresarDescuento)
      ingresarDescuento._id = discount.insertedId
    } catch (error) {
      return ingresarDescuento
    }

  },
  newProyect: async(root, {name, city, country, zone, direction, total_of_levels, living_levels, deposit_percent, header_img, company_id, company_name, lat, long })=>{
    let db
    let proyect
    const newProyect ={
      name,
      city,
      country,
      zone,
      direction,
      website: "",
      general_description: "",
      general_apartament_description: "",
      total_of_levels,
      living_levels,
      levels: [],
      long,
      lat,
      point:[long, lat],
      company_id,
      company_name,
      deposit_percent,
      financing_types: [],
      discounts: [],
      header_img,
      outside_images: [],
      inside_images: [],
      quote_logo: "",
      quote_banner: ""
    }
    const ingresarProyecto = Object.assign(newProyect)
    try {
      db = await connectDB()
      ingresarProyecto = await db
      .collection("proyects")
      .insertOne(ingresarProyecto)
      ingresarProyecto._id = proyect.insertedId
    } catch (error) {
      return ingresarProyecto
    }
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
  addProyectToDeveloper: async (root, { developerID, proyectID }) => {
    let db;
    let desarrolladora;
    let proyecto;
    try {
      db = await connectDB();
      //buscar Desarrolladora
      desarrolladora = await db
        .collection("realStateDevelopers")
        .findOne({ _id: ObjectID(developerID) });
      //buscar Vendedor  
      proyecto = await db
        .collection("proyects")
        .findOne({ _id: ObjectID(proyectID) });
      if (!desarrolladora || !proyecto) {
        throw new Error("La desarrolladora o el Vendedor no existen.");
    }
      await db
        .collection("realStateDevelopers")
        .updateOne(
          { _id: ObjectID(developerID) },
          { $addToSet: { proyects: ObjectID(proyectID) } }
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
      
      deleteSeller: async(root, {developerID, userID}) =>{
        let db
        let deleteUser
        let removeFromCompany
        try {
          db = await connectDB();
          deleteUser = await db
          .collection("users")
          .deleteOne({ _id: ObjectID(userID)})
        } catch (error) {
          throw error
        }
        try {
          db = await connectDB();
          removeFromCompany = await db
          .collection("realStateDevelopers")
          .updateOne({ _id: ObjectID(developerID) }
        , {$pull:{sellers_team: ObjectID(userID)}});
        } catch (error) {
          
        }
        return{
          deleteUser,
          removeFromCompany
        }
      }
};
