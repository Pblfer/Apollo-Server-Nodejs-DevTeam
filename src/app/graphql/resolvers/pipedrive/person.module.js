const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type PipedrivePerson {
    id: ID!
    name: String
    email: [ContactValue]
    phone: [ContactValue]
  }

  type ContactValue {
    label: String
    value: String
    primary: Boolean
  }
`;

module.exports = { typeDefs };
