const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type PipedriveOrganization {
    id: ID!
    name: String
  }
`;

module.exports = { typeDefs };
