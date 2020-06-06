const { gql } = require("apollo-server-express");

const searchPersons = require("@app/graphql/services/pipedrive/findPerson");

const typeDefs = gql`
  extend type Query {
    PipedrivePerson(
      term: String!
      organizationId: Int!
      searchByEmail: Boolean
    ): [PipedrivePerson]
  }

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

const resolvers = {
  Query: {
    async PipedrivePerson(_, { term, organizationId, searchByEmail }) {
      return searchPersons(term, organizationId, searchByEmail);
    },
  },
};

module.exports = { typeDefs, resolvers };
