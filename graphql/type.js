"use strict";
const connectDB = require("./db");
const { ObjectID } = require("mongodb");

module.exports = {
    Developer:{
        sellers_team: async ({sellers_team}) =>{
            let db
            let sellersData
            let ids
            try {
                db = await connectDB()
                ids= sellers_team ? sellers_team.map(id => ObjectID(id)) : []
                sellersData = ids.length > 0 ?
                await db.collection('users').find(
                    {_id: {$in: ids}}
                ).toArray()
                : []
            } catch (err) {
                console.log(err)
            }
            return sellersData
        },
        proyects: async ({proyects}) =>{
            let db
            let proyectData
            let ids
            try {
                db = await connectDB()
                ids= proyects ? proyects.map(id => ObjectID(id)) : []
                proyectData = ids.length > 0 ?
                await db.collection('proyects').find(
                    {_id: {$in: ids}}
                ).toArray()
                : []
            } catch (err) {
                console.log(err)
            }
            return proyectData
        },
        clients: async ({clients}) =>{
            let db
            let clientData
            let ids
            try {
                db = await connectDB()
                ids= clients ? clients.map(id => ObjectID(id)) : []
                clientData = ids.length > 0 ?
                await db.collection('clients').find(
                    {_id: {$in: ids}}
                ).toArray()
                : []
            } catch (err) {
                console.log(err)
            }
            return clientData
        }
    },

    Proyect:{
        levels: async ({levels}) =>{
            let db
            let levelsData
            let ids
            try {
                db = await connectDB()
                ids= levels ? levels.map(id => ObjectID(id)) : []
                levelsData = ids.length > 0 ?
                await db.collection('levels').find(
                    {_id: {$in: ids}}
                ).toArray()
                : []
            } catch (err) {
                console.log(err)
            }
            return levelsData
        },

        parkings: async ({parkings}) =>{
            let db
            let parkingData
            let ids
            try {
                db = await connectDB()
                ids= parkings ? parkings.map(id => ObjectID(id)) : []
                parkingData = ids.length > 0 ?
                await db.collection('parkings').find(
                    {_id: {$in: ids}}
                ).toArray()
                : []
            } catch (err) {
                console.log(err)
            }
            return parkingData
        },

        gallery: async ({gallery}) =>{
            let db
            let imgData
            let ids
            try {
                db = await connectDB()
                ids= gallery ? gallery.map(id => ObjectID(id)) : []
                imgData = ids.length > 0 ?
                await db.collection('images').find(
                    {_id: {$in: ids}}
                ).toArray()
                : []
            } catch (err) {
                console.log(err)
            }
            return imgData
        },

        warehouses: async ({warehouses}) =>{
            let db
            let warehouseData
            let ids
            try {
                db = await connectDB()
                ids= warehouses ? warehouses.map(id => ObjectID(id)) : []
                warehouseData = ids.length > 0 ?
                await db.collection('warehouses').find(
                    {_id: {$in: ids}}
                ).toArray()
                : []
            } catch (err) {
                console.log(err)
            }
            return warehouseData
        },

        discounts: async ({discounts}) =>{
            let db
            let discountData
            let ids
            try {
                db = await connectDB()
                ids= discounts ? discounts.map(id => ObjectID(id)) : []
                discountData = ids.length > 0 ?
                await db.collection('discounts').find(
                    {_id: {$in: ids}}
                ).toArray()
                : []
            } catch (err) {
                console.log(err)
            }
            return discountData
        }
    },

    Level:{
        inventory: async ({inventory}) =>{
            let db
            let ApartamentsData
            let ids
            try {
                db = await connectDB()
                ids= inventory ? inventory.map(id => ObjectID(id)) : []
                ApartamentsData = ids.length > 0 ?
                await db.collection('apartaments').find(
                    {_id: {$in: ids}}
                ).toArray()
                : []
            } catch (err) {
                console.log(err)
            }
            return ApartamentsData
        }
    }

}