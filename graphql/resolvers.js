'use strict'

//Importacion
const mutations = require('./mutations')
const queries = require('./queries')
const types = require('./type')

module.exports = {
    Query: queries,
    Mutation: mutations,
    ...types
}
    