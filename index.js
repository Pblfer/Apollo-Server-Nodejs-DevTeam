const { ApolloServer } = require('apollo-server');
const {readFileSync} = require('fs')
const {join} = require('path')

const typeDefs = readFileSync(
  join(__dirname, 'graphql', 'schema.graphql'),
  'utf-8'
)

// graphQl
const resolvers = require('./graphql/resolvers')

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(process.env.PORT || 4000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});