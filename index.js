require("dotenv").config();

const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const httpStatus = require("http-status");
const morgan = require("morgan");

const { ApolloServer, gql } = require("apollo-server-express");
const { readFileSync } = require("fs");
const { buildFederatedSchema } = require("@apollo/federation");

const { join } = require("path");

// GraphQL Modules
const modules = require("./src/app/graphql/resolvers");

// Rest Endpoint
const { quotationsRoute } = require("./src/app/rest");

// Express
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "10mb", type: "*/*" }));
app.use(morgan("short"));
app.use(helmet());

// Rest
app.use((err, req, res, next) => {
  res.setHeader("charset", "utf-8");
  res.setHeader("Content-Type", "application/json");
  next();
});

app.get("/rest", (req, res) => {
  res.status(httpStatus.OK).json({
    hello: "Welcome to Flattlo API",
    version: process.env.npm_package_version,
  });
});

app.use("/rest/quotations", quotationsRoute);

// graphQl
const typeDefs = readFileSync(
  join(__dirname, "graphql", "schema.graphql"),
  "utf-8"
);

const resolvers = require("./graphql/resolvers");

const flattloModule = {
  typeDefs: gql`
    ${typeDefs}
  `,
  resolvers,
};
const schema = [...modules, flattloModule];

const server = new ApolloServer({
  schema: buildFederatedSchema(schema),
  playground: true,
  introspection: true,
});

server.applyMiddleware({ app, path: "/" });

app.listen({ port: process.env.PORT || 4000 }, () =>
  console.log("🚀 Server ready")
);
