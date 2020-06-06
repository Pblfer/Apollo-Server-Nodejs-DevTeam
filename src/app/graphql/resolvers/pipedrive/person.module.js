const { gql } = require("apollo-server-express");

const searchPersons = require("@app/graphql/services/pipedrive/findPerson");
const addPerson = require("@app/graphql/services/pipedrive/addPerson");

const typeDefs = gql`
  extend type Mutation {
    AddPipedrivePerson(
      name: String!
      email: String!
      organizationId: Int
      phone: String
    ): PipedrivePerson!
  }

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
  Mutation: {
    async AddPipedrivePerson(_, { name, email, organizationId, phone }) {
      return addPerson(name, email, organizationId, phone);
    },
  },
};

module.exports = { typeDefs, resolvers };
