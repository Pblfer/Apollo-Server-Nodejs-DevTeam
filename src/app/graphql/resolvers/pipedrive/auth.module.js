const { gql } = require("apollo-server-express");

const authorize = require("@app/graphql/services/pipedrive/authorize");

const typeDefs = gql`
  extend type Mutation {
    AuthorizeApp(code: String!): Boolean
  }
`;

const resolvers = {
  Mutation: {
    async AuthorizeApp(_, { code }) {
      return authorize(code);
    },
  },
};

module.exports = { typeDefs, resolvers };
