"use strict";
const connectDB = require("./db");
const { ObjectID } = require("mongodb");

module.exports = {
    Developer:{
        sellers: async ({sellers}) =>{
            let db
            let sellersData
            let ids
            try {
                db = await connectDB()
                ids= sellers ? sellers.map(id => ObjectID(id)) : []
                sellersData = ids.length > 0 ?
                await db.collection('vendedores').find(
                    {_id: {$in: ids}}
                ).toArray()
                : []
            } catch (err) {
                console.log(err)
            }
            return sellersData
        }
    }

}