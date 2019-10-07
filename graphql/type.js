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
        }
    
    
    
    
    },

}