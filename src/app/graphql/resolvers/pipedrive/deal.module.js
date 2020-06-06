const { gql } = require("apollo-server-express");

const getDeal = require("@app/graphql/services/pipedrive/getDeal");

const typeDefs = gql`
  extend type Query {
    PipedriveDeal(id: Int!): PipedriveDeal
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
    async PipedriveDeal(_, { id }) {
      return getDeal(id);
    },
  },
};

module.exports = { typeDefs, resolvers };
