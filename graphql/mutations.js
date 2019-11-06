"use strict";
const connectDB = require("./db");
const { ObjectID } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
      img_header:
        "https://firebasestorage.googleapis.com/v0/b/cotizador-conversion.appspot.com/o/stockImages%2Fcover.jpg?alt=media&token=67860976-2d6d-4f5b-9b40-9cdc4873d24a",
      cc_token: "",
      proyects: [],
      admins_team: [],
      sellers_team: [],
      clients:[]
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

  newUser: async (
    root,
    {
      email,
      password,
      first_name,
      last_name,
      company,
      company_id,
      phone,
      roll,
      blocked
    }
  ) => {
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = {
      first_name,
      last_name,
      email,
      password: hashPassword,
      company,
      company_id,
      phone,
      pic:
        "https://firebasestorage.googleapis.com/v0/b/cotizador-conversion.appspot.com/o/stockImages%2FuserDefaultPic.jpg?alt=media&token=7bacc009-b998-4abf-8722-79a5dae8f6c8",
      roll,
      blocked
    };
    const nuevoUsuario = Object.assign(newUser);
    let db;
    let usuario;
    try {
      db = await connectDB();
      nuevoUsuario = await db.collection("users").insertOne(nuevoUsuario);
      nuevoUsuario._id = usuario.insertedId;
    } catch (error) {}
    return nuevoUsuario;
  },

  
  newProyect: async (
    root,
    {
      name,
      etapa,
      city,
      country,
      website,
      general_description,
      zone,
      direction,
      total_of_levels,
      living_levels,
      total_apartaments,
      deposit_percent,
      header_img,
      company_id,
      company_name,
      lat,
      long
    }
  ) => {
    let db;
    let proyect;
    const newProyect = {
      name,
      city,
      country,
      zone,
      direction,
      website,
      general_description,
      general_apartament_description: "",
      total_of_levels,
      living_levels,
      total_apartaments,
      levels: [],
      parkings: [],
      long,
      lat,
      point: [long, lat],
      company_id,
      company_name,
      deposit_percent,
      financing_types: [],
      fraction_reserved: 0,
      discounts: [],
      header_img,
      gallery: [],
      quote_logo: "",
      quote_banner: "",
      etapa
    };
    const ingresarProyecto = Object.assign(newProyect);
    try {
      db = await connectDB();
      ingresarProyecto = await db
        .collection("proyects")
        .insertOne(ingresarProyecto);
      ingresarProyecto._id = proyect.insertedId;
    } catch (error) {
      return ingresarProyecto;
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
      usuario = await db.collection("users").findOne({ _id: ObjectID(userID) });
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
      console.log(error);
    }
    return desarrolladora;
  },

  newClientToDeveloper: async (root, { email, developerID, first_name, last_name, phone, nit}) => {
    let db;
    let cliente;
    let Developer;
    const newClient = {
      email, developerID, first_name, last_name, phone, nit
    };
    const ingresarCliente = Object.assign(newClient);
    try {
      db = await connectDB();
      ingresarCliente = await db
        .collection("clients")
        .insertOne(ingresarCliente);
        ingresarCliente._id = cliente.insertedId;
    } catch (err) {
      db = await connectDB();
      Developer = await db
        .collection("realStateDevelopers")
        .updateOne(
          { _id: ObjectID(developerID) },
          { $addToSet: { clients: ObjectID(ingresarCliente._id) } }
        );
      return ingresarCliente;
    }
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
      console.log(error);
    }
    return desarrolladora;
  },

  addImageToProyect: async (root ,{proyect_id, image_name, proyect_name ,lat, long, img_url, gallery_type}) =>{
    let db;
    let imagen;
    let proyecto;
    const newImage = {
      image_name,
      proyect_id, 
      proyect_name,
      point: [long, lat],
      img_url,
      gallery_type
    };
    const ingresarImage = Object.assign(newImage);
    try {
      db = await connectDB();
      ingresarImage = await db
        .collection("images")
        .insertOne(ingresarImage);
        ingresarImage._id = imagen.insertedId;
    } catch (err) {
      db = await connectDB();
      proyecto = await db
        .collection("proyects")
        .updateOne(
          { _id: ObjectID(proyect_id) },
          { $addToSet: { gallery: ObjectID(ingresarImage._id) } }
        );
      return ingresarImage;
    }
  },

  newDiscountToProyect: async(root, {name, company_id, proyect_id, discount_amount, active}) =>{
    let db;
    let descuento;
    let proyecto;
    const nuevoDescuento = {
      name, company_id, proyect_id, discount_amount, active
    };
    const ingresarDescuento = Object.assign(nuevoDescuento);
    try {
      db = await connectDB();
      ingresarDescuento = await db
        .collection("discounts")
        .insertOne(ingresarDescuento);
        ingresarDescuento._id = descuento.insertedId;
    } catch (err) {
      db = await connectDB();
      proyecto = await db
        .collection("proyects")
        .updateOne(
          { _id: ObjectID(proyect_id) },
          { $addToSet: { discounts: ObjectID(ingresarDescuento._id) } }
        );
      return ingresarDescuento;
    }
  }, 

  newFinancingToProyect: async(root, {name, interest_rate, years_max, proyectID}) =>{
    let db;
    let financiamiento;
    let proyecto;
    const nuevoFinanciamiento = {
      name, interest_rate, years_max, proyectID
    };
    const ingresarFinanciamiento = Object.assign(nuevoFinanciamiento);
    try {
      db = await connectDB();
      ingresarFinanciamiento = await db
        .collection("financing_types")
        .insertOne(ingresarFinanciamiento);
        ingresarFinanciamiento._id = financiamiento.insertedId;
    } catch (err) {
      db = await connectDB();
      proyecto = await db
        .collection("proyects")
        .updateOne(
          { _id: ObjectID(proyectID) },
          { $addToSet: { financing_types: ObjectID(ingresarFinanciamiento._id) } }
        );
      return ingresarFinanciamiento;
    }
  }, 

  addParkingToProyect: async (
    root,
    { number, price, actual_state, proyectID, developerID }
  ) => {
    let db;
    let parqueo;
    let proyecto;
    const newParking = {
      number,
      price,
      actual_state,
      proyectID,
      developerID
    };
    const ingresarParqueo = Object.assign(newParking);
    try {
      db = await connectDB();
      ingresarParqueo = await db
        .collection("parkings")
        .insertOne(ingresarParqueo);
      ingresarParqueo._id = parqueo.insertedId;
    } catch (err) {
      db = await connectDB();
      proyecto = await db
        .collection("proyects")
        .updateOne(
          { _id: ObjectID(proyectID) },
          { $addToSet: { parkings: ObjectID(ingresarParqueo._id) } }
        );
      return ingresarParqueo;
    }
  },

  addWarehouseToProyect: async (
    root,
    { number, price, square_mts, actual_state, proyectID, developerID }
  ) => {
    let db;
    let bodega;
    let proyecto;
    const newWarehouse = {
      number,
      price,
      square_mts,
      actual_state,
      proyectID,
      developerID
    };
    const ingresarBodega = Object.assign(newWarehouse);
    try {
      db = await connectDB();
      ingresarBodega = await db
        .collection("warehouses")
        .insertOne(ingresarBodega);
        ingresarBodega._id = bodega.insertedId;
    } catch (err) {
      db = await connectDB();
      proyecto = await db
        .collection("proyects")
        .updateOne(
          { _id: ObjectID(proyectID) },
          { $addToSet: { warehouses: ObjectID(ingresarBodega._id) } }
        );
      return ingresarBodega;
    }
  },

  addLevelToProyect: async (
    root,
    { developerID, proyectID, number_of_level, plane_img_url }
  ) => {
    let db;
    let level;
    let proyecto;
    const newLevel = {
      developerID,
      proyectID,
      number_of_level,
      plane_img_url,
      inventory: []
    };
    const ingresarNivel = Object.assign(newLevel);
    try {
      db = await connectDB();
      ingresarNivel = await db.collection("levels").insertOne(ingresarNivel);
      ingresarNivel._id = level.insertedId;
    } catch (err) {
      db = await connectDB();
      proyecto = await db
        .collection("proyects")
        .updateOne(
          { _id: ObjectID(proyectID) },
          { $addToSet: { levels: ObjectID(ingresarNivel._id) } }
        );
      return ingresarNivel;
    }
  },

  addApartamentToLevel: async (
    root,
    {
      proyect_name,
      plane_img,
      level,
      number,
      apt_type,
      living_square_mts,
      bedrooms,
      bathrooms,
      loundry,
      balcony,
      kitchen_furniture,
      closets,
      kitchen_appliances,
      garden,
      price,
      actual_state,
      lat,
      long,
      levelID
    }
  ) => {
    let apartament;
    let db;
    let addTolevel;
    const newApartament = {
      proyect_name,
      plane_img,
      level,
      number,
      apt_type,
      living_square_mts,
      bedrooms,
      bathrooms,
      loundry,
      balcony,
      kitchen_furniture,
      closets,
      kitchen_appliances,
      garden,
      price,
      price_with_tax:0,
      reserve_price:0,
      actual_state,
      type,
      lat,
      long,
      point: [long, lat],
      financing_types: []
    };
    const ingresarApartamento = Object.assign(newApartament);
    try {
      db = await connectDB();
      ingresarApartamento = await db
        .collection("apartaments")
        .insertOne(ingresarApartamento);
      ingresarApartamento._id = apartament.insertedId;
    } catch (err) {
      db = await connectDB();
      addTolevel = await db
        .collection("levels")
        .updateOne(
          { _id: ObjectID(levelID) },
          { $addToSet: { inventory: ObjectID(ingresarApartamento._id) } }
        );
      return ingresarApartamento;
    }
  },

  importApartaments: async (
    root,
    {
      proyect_name,
      level,
      number,
      apt_type,
      living_square_mts,
      bedrooms,
      bathrooms,
      loundry,
      balcony,
      kitchen_furniture,
      closets,
      kitchen_appliances,
      garden,
      price,
      actual_state,
      lat,
      long,
      proyect_id,
      developer_id
    }
  ) => {
    let apartament;
    let db;
    let addTolevel;
    const newApartament = {
      proyect_name,
      plane_img:
        "https://firebasestorage.googleapis.com/v0/b/cotizador-conversion.appspot.com/o/stockImages%2FsinPLanoAdjunto.jpg?alt=media&token=e4ed2662-d967-4659-af22-1d8f2511c95a",
      level,
      number,
      living_square_mts,
      bedrooms,
      bathrooms,
      loundry,
      balcony,
      kitchen_furniture,
      closets,
      kitchen_appliances,
      garden,
      price,
      price_with_tax: null,
      reserve_price: null,
      actual_state,
      apt_type,
      lat,
      long,
      point: [long, lat],
      financing_types: []
    };
    const ingresarApartamento = Object.assign(newApartament);
    try {
      db = await connectDB();
      ingresarApartamento = await db
        .collection("apartaments")
        .insertOne(ingresarApartamento);
      ingresarApartamento._id = apartament.insertedId;
    } catch (err) {
      db = await connectDB();
      addTolevel = await db
        .collection("levels")
        .updateOne(
          {
            developerID: developer_id,
            proyectID: proyect_id,
            number_of_level: level
          },
          { $addToSet: { inventory: ObjectID(ingresarApartamento._id) } }
        );
      return ingresarApartamento;
    }
  },

  login: async (root, { username, password }) => {
    let db;
    let user;
    try {
      db = await connectDB();
      user = await db.collection("users").findOne({ email: username });
      if (!user) {
        throw new Error("Invalid Login, ErrM01");
      }

      const isEqual = await bcrypt.compare(password, user.password);

      if (!isEqual) {
        throw new Error("Invalid Login, ErrM02");
      }
    } catch (error) {
      throw error;
    }
    const token = jwt.sign(
      {
        userID: user.id,
        email: user.email
      },
      "67D89823E8A7382CC78D5285B1C42",
      {
        expiresIn: "12h" // token will expire in 30days
      }
    );
    return {
      token,
      user
    };
  },

  updataDeveloperProfile: async (root, { developerID, objectField, value }) => {
    let db;
    let updateData;
    try {
      db = await connectDB();
      updateData = await db
        .collection("realStateDevelopers")
        .updateOne(
          { _id: ObjectID(developerID) },
          { $set: { [objectField]: value } }
        );
    } catch (error) {
      throw error;
    }
    return {
      objectField,
      value
    };
  },

  updateUserProfile: async (root, { ID, objectField, value }) => {
    let db;
    let updateData;
    try {
      db = await connectDB();
      updateData = await db
        .collection("users")
        .updateOne({ _id: ObjectID(ID) }, { $set: { [objectField]: value } });
    } catch (error) {
      throw error;
    }
    return {
      objectField,
      value
    };
  },

  deleteSeller: async (root, { developerID, userID }) => {
    let db;
    let deleteUser;
    let removeFromCompany;
    try {
      db = await connectDB();
      deleteUser = await db
        .collection("users")
        .deleteOne({ _id: ObjectID(userID) });
    } catch (error) {
      throw error;
    }
    try {
      db = await connectDB();
      removeFromCompany = await db
        .collection("realStateDevelopers")
        .updateOne(
          { _id: ObjectID(developerID) },
          { $pull: { sellers_team: ObjectID(userID) } }
        );
    } catch (error) {}
    return {
      deleteUser,
      removeFromCompany
    };
  }
};
