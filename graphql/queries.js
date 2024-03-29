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
  getNotifyDevelopers: async () => {
    let db;
    let notificaciones = [];
    try {
      db = await connectDB();
      notificaciones = await db.collection("notificaciones").find().toArray();
    } catch (error) {
      console.log(error);
    }
    return notificaciones;
  },
  getNotify: async (root, { id }) => {
    let db;
    let notificaciones = [];
    try {
      db = await connectDB();
      notificaciones = await db
        .collection("notificaciones")
        .findOne({ _id: ObjectID(id) });
    } catch (error) {
      console.log(error);
    }
    return notificaciones;
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
  getFlattloClientByID: async (root, { clientID }) => {
    let db;
    let cliente;
    try {
      db = await connectDB();
      cliente = await db
        .collection("clients")
        .findOne({ _id: ObjectID(clientID) });
    } catch (error) {
      console.log(error);
    }
    return cliente;
  },

  getAllUsers: async () => {
    let db;
    let usuarios = [];
    try {
      db = await connectDB();
      usuarios = await db.collection("users").find().toArray();
    } catch (error) {
      console.log(error);
    }
    return usuarios;
  },
  getAllSeller: async (root,{developerID}) => {
    let db;
    let seller = []
    try{
      db = await connectDB();
      seller = await db.collection("users").find({company_id: developerID}).toArray();
    }catch(error){
      console.log(error)
    }
    return seller;
  },
  getUser: async (root, { id }) => {
    let db;
    let usuario;
    try {
      db = await connectDB();
      usuario = await db.collection("users").findOne({ _id: ObjectID(id) });
    } catch (error) {
      console.log(error);
    }
    return usuario;
  },
  getQuoteDate: async (root, { id }) => {
    let db;
    let usuario;

    let newDate = new Date();
    let d = newDate.getDate();
    let m = newDate.getMonth() + 1;
    let y = newDate.getFullYear();

    if (d < 10) {
      d = "0" + d;
    }

    if (m < 10) {
      m = "0" + m;
    }
    let datefull = y + "-" + m + "-" + "01";
    try {
      db = await connectDB();
      usuario = await db
        .collection("quotes")
        .find({
          userID: id,
          quote_date_created: { $gte: new Date(datefull) },
        })
        .toArray();
    } catch (error) {
      console.log(error);
    }
    return usuario;
  },
  getReserveDate: async (root, { id }) => {
    let db;
    let reservas;

    let newDate = new Date();
    let d = newDate.getDate();
    let m = newDate.getMonth() + 1;
    let y = newDate.getFullYear();

    if (d < 10) {
      d = "0" + d;
    }

    if (m < 10) {
      m = "0" + m;
    }
    let datefull = y + "-" + m + "-" + "01";
    try {
      db = await connectDB();
      reservas = await db
        .collection("reserves")
        .find({
          developerID: id,
          date_created: { $gte: new Date(datefull) },
        })
        .toArray();
    } catch (error) {
      console.log(error);
    }
    return reservas;
  },
  getQuoteExpires: async (root, { id }) => {
    let db;
    let usuario;
    let expires = [];
    let newDate = new Date();
    let d = newDate.getDate();
    let m = newDate.getMonth() + 1;
    let y = newDate.getFullYear();

    if (d < 10) {
      d = "0" + d;
    }

    if (m < 10) {
      m = "0" + m;
    }
    let datefull = y + "-" + m + "-" + "01";
    let datefullDay = y + "-" + m + "-" + d;
    try {
      db = await connectDB();
      usuario = await db
        .collection("quotes")
        .find({
          userID: id,
        })
        .toArray();
    } catch (error) {
      console.log(error);
    }

    usuario.forEach(function (e) {
      let fecha1 = new Date(e.quote_date_limit);
      let fecha2 = new Date(datefullDay);

      if (fecha1 < fecha2) {
        expires.push(e);
      }
    });

    return expires;
  },
  getQuoteGreen: async (root, { id }) => {
    let db;
    let usuario;
    let green = [];
    let newDate = new Date();
    let d = newDate.getDate();
    let m = newDate.getMonth() + 1;
    let y = newDate.getFullYear();

    if (d < 10) {
      d = "0" + d;
    }

    if (m < 10) {
      m = "0" + m;
    }
    let datefull = y + "-" + m + "-" + "01";
    let datefullDay = y + "-" + m + "-" + d;
    try {
      db = await connectDB();
      usuario = await db
        .collection("quotes")
        .find({
          userID: id,
        })
        .toArray();
    } catch (error) {
      console.log(error);
    }

    usuario.forEach(function (e) {
      let fecha1 = new Date(e.quote_date_limit);
      let fecha2 = new Date(datefullDay);

      if (fecha1 >= fecha2) {
        green.push(e);
      }
    });

    return green;
  },

  getFlattloAppUser: async (root, { userUID }) => {
    let db;
    let flattloUser;
    try {
      db = await connectDB();
      flattloUser = await db
        .collection("clients")
        .findOne({ userUID: userUID });
    } catch (error) {
      console.log(error);
    }

    return flattloUser;
  },

  getProyect: async (root, { proyectID }) => {
    let db;
    let proyect;
    try {
      db = await connectDB();
      proyect = await db
        .collection("proyects")
        .findOne({ _id: ObjectID(proyectID) });
    } catch (err) {
      console.log(err);
    }
    return proyect;
  },

  getLevel: async (root, { levelID }) => {
    let db;
    let level;
    try {
      db = await connectDB();
      level = await db.collection("levels").findOne({ _id: ObjectID(levelID) });
    } catch (err) {
      console.log(err);
    }
    return level;
  },

  getApartament: async (root, { apartamentID }) => {
    let db;
    let apartament;
    try {
      db = await connectDB();
      apartament = await db
        .collection("apartaments")
        .findOne({ _id: ObjectID(apartamentID) });
    } catch (err) {
      console.log(err);
    }
    return apartament;
  },

  getQuoteByID: async (root, { quoteID }) => {
    let db;
    let quote;
    try {
      db = await connectDB();
      quote = await db.collection("quotes").findOne({ _id: ObjectID(quoteID) });
    } catch (err) {
      console.log(err);
    }
    return quote;
  },

  getFlattloQuoteByID: async (root, { quoteID }) => {
    let db;
    let quote;
    try {
      db = await connectDB();
      quote = await db.collection("quotes").findOne({ _id: ObjectID(quoteID) });
    } catch (err) {
      console.log(err);
    }
    return quote;
  },

  getWarehouseByID: async (root, { warehouseID }) => {
    let db;
    let warehouse;
    try {
      db = await connectDB();
      warehouse = await db
        .collection("warehouses")
        .findOne({ _id: ObjectID(warehouseID) });
    } catch (err) {
      console.log(err);
    }
    return warehouse;
  },
  getNotifyState: async (root, { id }) => {
    let db;
    let notificaciones;
    let notificacionesArray = [];
    let array = [];
    let DatosFiltrados;
    let valuePush = {};
    try {
      db = await connectDB();
      notificaciones = await db.collection("users").findOne({
        _id: ObjectID(id),
      });
      function esDato(dato) {
        return dato.estado === 0;
      }

      notificacionesArray.push(notificaciones);
      DatosFiltrados = notificaciones.notifications.filter(esDato);

      DatosFiltrados.forEach(function (e) {
        array.push(e);
      });
      valuePush = array;

      var nuevoValor = valuePush;

      notificacionesArray.forEach(function (item) {
        item.notifications = nuevoValor;
      });
    } catch (error) {
      console.log(error);
    }

    return notificaciones;
  },
};
