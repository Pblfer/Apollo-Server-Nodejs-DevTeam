const { gql } = require("apollo-server-express");

const getDeal = require("../services/getDeal");

const typeDefs = gql`
  extend type Query {
    pipedriveDeal(id: Int!): PipedriveDeal
  }

  type PipedriveDeal {
    id: ID!
    companyId: ID
    organization: PipedriveOrganization
    person: PipedrivePerson
  }
`;

const resolvers = {
  Query: {
    async pipedriveDeal(_, { id }) {
      return getDeal(id);
    },
  },
};

module.exports = { typeDefs, resolvers };
