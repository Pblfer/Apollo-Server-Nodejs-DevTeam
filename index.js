require('dotenv').config()
const { ApolloServer } = require('apollo-server');
const {readFileSync} = require('fs')
const {join} = require('path')
const {Storage} = require('@google-cloud/storage');

const typeDefs = readFileSync(
  join(__dirname, 'graphql', 'schema.graphql'),
  'utf-8'
)

//Google Cloud Storage
const gcs = new Storage();

// graphQl
const resolvers = require('./graphql/resolvers')

const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  introspection: true,
  playground: true,
 });

server.listen(process.env.PORT || 4000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});