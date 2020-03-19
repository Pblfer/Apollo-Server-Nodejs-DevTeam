"use strict";
const connectDB = require("./db");
const { ObjectID } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const https = require("https");

module.exports = {
  newDeveloper: async (
    root,
    { name, plan, phone_area, phone, address, email, website }
  ) => {
    const defaults = {
      name,
      plan,
      phone_area,
      phone,
      address,
      email,
      website,
      description: "",
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
      clients: []
    };
    const nuevaDesarrolladora = Object.assign(defaults);
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
  newNotification: async (
    root,
    { name, description, icon, type, date_created, company_id }
  ) => {
    if (type == null) {
      type = "primary";
    } else {
      type = type;
    }
    const defaults = {
      name,
      description,
      icon,
      type,
      date_created,
      company_id
    };
    const nuevaNotificacion = Object.assign(defaults);
    let db;
    let notificaciones;

    try {
      db = await connectDB();
      nuevaNotificacion = await db
        .collection("notificaciones")
        .insertOne(nuevaNotificacion);
      nuevaNotificacion._id = notificaciones.insertedId;
    } catch (error) {}
    return nuevaNotificacion;
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
      blocked,
      quotes: [],
      notifications: []
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
      fraction_reserved,
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
      fraction_reserved,
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
      max_days_limit_for_quote: 15,
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

  blockUser: async (root, { userID }) => {
    let db;
    let usuario;
    try {
      db = await connectDB();
      usuario = await db
        .collection("users")
        .updateOne(
          { _id: ObjectID(userID) },
          { $set: { blocked: "Bloqueado" } }
        );
    } catch (err) {
      throw err;
    }
  },

  activateUser: async (root, { userID }) => {
    let db;
    let usuario;
    try {
      db = await connectDB();
      usuario = await db
        .collection("users")
        .updateOne({ _id: ObjectID(userID) }, { $set: { blocked: "Activo" } });
    } catch (err) {
      throw err;
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

  addAdminToDeveloper: async (root, { developerID, userID }) => {
    let db;
    let desarrolladora;
    let usuario;
    try {
      db = await connectDB();
      //buscar Desarrolladora
      desarrolladora = await db
        .collection("realStateDevelopers")
        .findOne({ _id: ObjectID(developerID) });
      //buscar admin
      usuario = await db.collection("users").findOne({ _id: ObjectID(userID) });
      if (!desarrolladora || !usuario) {
        throw new Error("La desarrolladora o el Usuario no existen.");
      }
      await db
        .collection("realStateDevelopers")
        .updateOne(
          { _id: ObjectID(developerID) },
          { $addToSet: { admins_team: ObjectID(userID) } }
        );
    } catch (error) {
      console.log(error);
    }
    return desarrolladora;
  },

  newQuotetoSeller: async (
    root,
    {
      userID,
      developerCompanyName,
      barCode,
      quote_date_created,
      quote_date_limit,
      discount_mount,
      reserve_mount,
      promise_sign_mount,
      fraction_total_mount,
      fraction_month_selected,
      fraction_fee_mount,
      property_value,
      parkings_mount,
      warehouses_mount,
      taxes_mount,
      total_mount,
      financing_name,
      financing_total_mount,
      financing_interest_rate,
      financing_years_selected,
      financing_fee_mount,
      proyect_name,
      living_square_mts,
      bedrooms,
      bathrooms,
      lat,
      long,
      logo_quote_proyect
    }
  ) => {
    let db;
    let cotizacion;
    let vendendor;
    const nuevaCotizacion = {
      userID,
      developerCompanyName,
      barCode,
      quote_date_created,
      quote_date_limit,
      discount_mount,
      reserve_mount,
      promise_sign_mount,
      fraction_total_mount,
      fraction_month_selected,
      fraction_fee_mount,
      property_value,
      parkings_mount,
      warehouses_mount,
      taxes_mount,
      total_mount,
      financing_name,
      financing_total_mount,
      financing_interest_rate,
      financing_years_selected,
      financing_fee_mount,
      proyect_name,
      living_square_mts,
      bedrooms,
      bathrooms,
      logo_quote_proyect,
      client: [],
      apartaments: [],
      parkings: [],
      warehouses: [],
      point: [long, lat]
    };
    const ingresarCotizacion = Object.assign(nuevaCotizacion);
    try {
      db = await connectDB();
      ingresarCotizacion = await db
        .collection("quotes")
        .insertOne(ingresarCotizacion);
      ingresarCotizacion._id = cotizacion.insertedId;
    } catch (err) {
      db = await connectDB();
      vendendor = await db
        .collection("users")
        .updateOne(
          { _id: ObjectID(userID) },
          { $addToSet: { quotes: ObjectID(ingresarCotizacion._id) } }
        );
      return ingresarCotizacion;
    }
  },

  newClientToDeveloper: async (
    root,
    { email, developerID, first_name, last_name, phone, nit }
  ) => {
    let db;
    let cliente;
    let Developer;
    const newClient = {
      email,
      developerID,
      first_name,
      last_name,
      phone,
      nit
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

  addApartamentToQuote: async (root, { quoteID, apartamentID }) => {
    let db;
    let cotizacion;
    let apartament;
    try {
      db = await connectDB();
      //buscar Cotizacion
      cotizacion = await db
        .collection("quotes")
        .findOne({ _id: ObjectID(quoteID) });
      //buscar Apartamento
      apartament = await db
        .collection("apartaments")
        .findOne({ _id: ObjectID(apartamentID) });
      if (!cotizacion || !apartament) {
        throw new Error("El apartamento o la cotizacion no existen.");
      }
      await db.collection("quotes").updateOne(
        { _id: ObjectID(quoteID) },
        {
          $addToSet: {
            apartaments: ObjectID(apartamentID)
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
    return cotizacion;
  },

  addParkingToQuote: async (root, { quoteID, parkingID }) => {
    let db;
    let cotizacion;
    let parqueo;
    try {
      db = await connectDB();
      //buscar Cotizacion
      cotizacion = await db
        .collection("quotes")
        .findOne({ _id: ObjectID(quoteID) });
      //buscar Parqueo
      parqueo = await db
        .collection("parkings")
        .findOne({ _id: ObjectID(parkingID) });
      if (!cotizacion || !parqueo) {
        throw new Error("El parqueo o la cotizacion no existen.");
      }
      await db.collection("quotes").updateOne(
        { _id: ObjectID(quoteID) },
        {
          $addToSet: {
            parkings: ObjectID(parkingID)
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
    return parqueo;
  },

  addWarehouseToQuote: async (root, { quoteID, warehouseID }) => {
    let db;
    let cotizacion;
    let bodega;
    try {
      db = await connectDB();
      //buscar Cotizacion
      cotizacion = await db
        .collection("quotes")
        .findOne({ _id: ObjectID(quoteID) });
      //buscar bodega
      bodega = await db
        .collection("warehouses")
        .findOne({ _id: ObjectID(warehouseID) });
      if (!cotizacion || !bodega) {
        throw new Error("La Bodega o la cotizacion no existen.");
      }
      await db.collection("quotes").updateOne(
        { _id: ObjectID(quoteID) },
        {
          $addToSet: {
            warehouses: ObjectID(warehouseID)
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
    return bodega;
  },

  addClientToQuote: async (root, { quoteID, clientID }) => {
    let db;
    let cotizacion;
    let cliente;
    try {
      db = await connectDB();
      //buscar Cotizacion
      cotizacion = await db
        .collection("quotes")
        .findOne({ _id: ObjectID(quoteID) });
      //buscar bodega
      cliente = await db
        .collection("clients")
        .findOne({ _id: ObjectID(clientID) });
      if (!cotizacion || !cliente) {
        throw new Error("El cliente o la cotizacion no existen.");
      }
      await db.collection("quotes").updateOne(
        { _id: ObjectID(quoteID) },
        {
          $addToSet: {
            client: ObjectID(clientID)
          }
        }
      );
      await db.collection("clients").updateOne(
        { _id: ObjectID(clientID) },
        {
          $addToSet: {
            quotes: ObjectID(quoteID)
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
    return cliente;
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
  addNotificationToDeveloper: async (root, { developerID, notifyID }) => {
    let db;
    let desarrolladora;
    let usuarios;
    let noficacion;
    try {
      db = await connectDB();
      //buscar Desarrolladora
      desarrolladora = await db
        .collection("realStateDevelopers")
        .findOne({ _id: ObjectID(developerID) });

      noficacion = await db
        .collection("notificaciones")
        .findOne({ _id: ObjectID(notifyID) });
      if (!desarrolladora || !noficacion) {
        throw new Error("La desarrolladora o el Vendedor no existen.");
      }
      await db
        .collection("realStateDevelopers")
        .updateOne(
          { _id: ObjectID(developerID) },
          { $addToSet: { notifications: ObjectID(notifyID) } }
        );
    } catch (error) {
      console.log(error);
    }

    usuarios = await db
      .collection("realStateDevelopers")
      .findOne({ _id: ObjectID(developerID) });
    usuarios.sellers_team.forEach(function(e) {
      try {
        db.collection("users").updateOne(
          { _id: ObjectID(e) },
          {
            $addToSet: {
              notifications: {
                _id: ObjectID(notifyID),
                estado: 0
              }
            }
          }
        );
      } catch (error) {
        console.log(error);
      }
    });

    usuarios.admins_team.forEach(function(e) {
      try {
        db.collection("users").updateOne(
          { _id: ObjectID(e) },
          {
            $addToSet: {
              notification: {
                _id: ObjectID(notifyID),
                estado: 0
              }
            }
          }
        );
      } catch (error) {
        console.log(error);
      }
    });

    return desarrolladora;
  },
  newNotificationSlack: async (
    root,
    { name, description, icon, type, date_created }
  ) => {
    if (type == null) {
      type = "primary";
    } else {
      type = type;
    }
    date_created = Date.now();
    icon = "AlertOctagonIcon";
    type = "primary";
    const defaults = {
      name,
      description,
      icon,
      type,
      date_created
    };
    const nuevaNotificacion = Object.assign(defaults);
    let db;
    let notificaciones;
    let desarrolladora;

    try {

      db = await connectDB();
      nuevaNotificacion = await db
        .collection("notificaciones")
        .insertOne(nuevaNotificacion);
      nuevaNotificacion._id = notificaciones.insertedId;
    } catch (error) {
      console.log(error);
    }
     //buscar Desarrolladora
    desarrolladora = db.collection("realStateDevelopers").find();
    desarrolladora.forEach(function(e) {
      e.sellers_team.forEach(function(e2) {
        db.collection("users").updateOne(
          { _id: ObjectID(e2) },
          {
            $addToSet: {
              notification: {
                _id: ObjectID(nuevaNotificacion._id),
                name: nuevaNotificacion.name,
                description: nuevaNotificacion.description,
                date_created: nuevaNotificacion.date_created,
                icon: nuevaNotificacion.icon,
                type: nuevaNotificacion.type,
                estado: 0
              }
            }
          }
        );
      });

      e.admins_team.forEach(function(e3) {
        db.collection("users").updateOne(
          { _id: ObjectID(e3) },
          {
            $addToSet: {
              notification: {
                _id: ObjectID(nuevaNotificacion._id),
                name: nuevaNotificacion.name,
                description: nuevaNotificacion.description,
                date_created: nuevaNotificacion.date_created,
                icon: nuevaNotificacion.icon,
                type: nuevaNotificacion.type,
                estado: 0
              }
            }
          }
        );
      });
    });

    return nuevaNotificacion;
  },

  updateStateNotification: async (root, { userID }) => {
    let db;
    let usuarios;
    try {
      db = await connectDB();

      usuarios = await db
        .collection("users")
        .findOne({ _id: ObjectID(userID) });

      let nusuarios;

      nusuarios = usuarios.notification;

      for (var i = 0; i < nusuarios.length; i++) {
        await db.collection("users").updateOne(
          { _id: ObjectID(userID), "notification.estado": 0 },
          {
            $set: {
              "notification.$.estado": 1
            }
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
    return usuarios;
  },

  addImageToProyect: async (
    root,
    { proyect_id, image_name, proyect_name, lat, long, img_url, gallery_type }
  ) => {
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
      ingresarImage = await db.collection("images").insertOne(ingresarImage);
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

  newDiscountToProyect: async (
    root,
    { name, company_id, proyect_id, discount_amount, active }
  ) => {
    let db;
    let descuento;
    let proyecto;
    const nuevoDescuento = {
      name,
      company_id,
      proyect_id,
      discount_amount,
      active
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

  newFinancingToProyect: async (
    root,
    { name, interest_rate, years_max, proyectID }
  ) => {
    let db;
    let financiamiento;
    let proyecto;
    const nuevoFinanciamiento = {
      name,
      interest_rate,
      years_max,
      proyectID
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
      proyecto = await db.collection("proyects").updateOne(
        { _id: ObjectID(proyectID) },
        {
          $addToSet: { financing_types: ObjectID(ingresarFinanciamiento._id) }
        }
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

  newApartament: async (
    root,
    {
      proyect_name,
      level,
      number,
      apt_type,
      plane_img,
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
      developer_id,
      reserve_price
    }
  ) => {
    let apartament;
    let db;
    let addTolevel;
    const nuevoApartament = {
      proyect_name,
      plane_img,
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
      price_with_tax: 0,
      reserve_price: 0,
      actual_state,
      apt_type,
      lat,
      long,
      reserve_price,
      point: [long, lat],
      financing_types: []
    };
    const ingresarApartamento = Object.assign(nuevoApartament);
    try {
      db = await connectDB();
      ingresarApartamento = await db
        .collection("apartaments")
        .insertOne(ingresarApartamento);
      ingresarApartamento._id = apartament.insertedId;
    } catch (err) {
      db = await connectDB();
      addTolevel = await db.collection("levels").updateOne(
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
      developer_id,
      reserve_price
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
      price_with_tax: 0,
      reserve_price: 0,
      actual_state,
      apt_type,
      lat,
      long,
      reserve_price,
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
      addTolevel = await db.collection("levels").updateOne(
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

  RestorePass: async (root, { username }) => {
    let db;
    let user;
    try {
      db = await connectDB();
      user = await db.collection("users").findOne({ email: username });
      if (!user) {
        throw new Error("Correo Invalido");
      }
      await db
        .collection("users")
        .updateOne(
          { _id: ObjectID(user._id) },
          { $set: { requestPassChange: "true" } }
        );
      const data = JSON.stringify({
        userData: user.email,
        userName: user.first_name,
        userLast: user.last_name,
        userCompany: user.company,
        userID: user._id
      });
      const options = {
        hostname: "dev.flattlo.com",
        port: 443,
        path: "/webhook/7/webhook/email-flattlo",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      };
      const req = https.request(options, res => {
        res.on("data", d => {
          process.stdout.write(d);
        });
      });

      req.on("error", error => {
        console.error(error);
      });

      req.write(data);
      req.end();
    } catch (error) {
      throw error;
    }

    return {
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

  updateUserPassword: async (root, { ID, newPass }) => {
    let db;
    let updateData;
    const hashPassword = await bcrypt.hash(newPass, 10);
    try {
      db = await connectDB();
      updateData = await db
        .collection("users")
        .updateOne({ _id: ObjectID(ID) }, { $set: { password: hashPassword } });
    } catch (error) {
      throw error;
    }
  },

  updateWarehouse: async (root, { warehouseID, objectField, value }) => {
    let db;
    let updateData;
    try {
      db = await connectDB();
      updateData = await db
        .collection("warehouses")
        .updateOne(
          { _id: ObjectID(warehouseID) },
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

  updateApartament: async (root, { ID, objectField, value }) => {
    let db;
    let updateData;
    try {
      db = await connectDB();
      updateData = await db
        .collection("apartaments")
        .updateOne({ _id: ObjectID(ID) }, { $set: { [objectField]: value } });
    } catch (error) {
      throw error;
    }
    return {
      objectField,
      value
    };
  },

  updateLevel: async (root, { levelID, objectField, value }) => {
    let db;
    let updateData;
    try {
      db = await connectDB();
      updateData = await db
        .collection("levels")
        .updateOne(
          { _id: ObjectID(levelID) },
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
  },

  deleteApartament: async (root, { apartamentID, levelID }) => {
    let db;
    let deleteApartament;
    let removeFromLevel;
    try {
      db = await connectDB();
      deleteApartament = await db
        .collection("apartaments")
        .deleteOne({ _id: ObjectID(apartamentID) });
    } catch (error) {
      throw error;
    }
    try {
      db = await connectDB();
      removeFromLevel = await db
        .collection("levels")
        .updateOne(
          { _id: ObjectID(levelID) },
          { $pull: { inventory: ObjectID(apartamentID) } }
        );
    } catch (error) {}
  },

  deleteLevel: async (root, { proyectID, levelID }) => {
    let db;
    let deleteLevel;
    let removeFromProyect;
    try {
      db = await connectDB();
      deleteLevel = await db
        .collection("levels")
        .deleteOne({ _id: ObjectID(levelID) });
    } catch (error) {
      throw error;
    }
    try {
      db = await connectDB();
      removeFromProyect = await db
        .collection("proyects")
        .updateOne(
          { _id: ObjectID(proyectID) },
          { $pull: { levels: ObjectID(levelID) } }
        );
    } catch (error) {}
  },

  deleteWareHouse: async (root, { proyectID, warehouseID }) => {
    let db;
    let deleteWarehouse;
    let removeFromProyect;
    try {
      db = await connectDB();
      deleteWarehouse = await db
        .collection("warehouses")
        .deleteOne({ _id: ObjectID(warehouseID) });
    } catch (error) {
      throw error;
    }
    try {
      db = await connectDB();
      removeFromProyect = await db
        .collection("proyects")
        .updateOne(
          { _id: ObjectID(proyectID) },
          { $pull: { warehouses: ObjectID(warehouseID) } }
        );
    } catch (error) {}
  },

  deleteParking: async (root, { proyectID, parkingID }) => {
    let db;
    let deleteParking;
    let removeFromProyect;
    try {
      db = await connectDB();
      deleteParking = await db
        .collection("warehouses")
        .deleteOne({ _id: ObjectID(parkingID) });
    } catch (error) {
      throw error;
    }
    try {
      db = await connectDB();
      removeFromProyect = await db
        .collection("proyects")
        .updateOne(
          { _id: ObjectID(proyectID) },
          { $pull: { parkings: ObjectID(parkingID) } }
        );
    } catch (error) {}
  }
};
