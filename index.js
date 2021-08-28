const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

const { DATABASE } = require("./config");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});
const port = process.env.PORT || 5000;
mongoose
  .connect(DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`mongodb connected at ${DATABASE}`);
    return server
      .listen({ port })
      .then(({ url }) => {
        console.log(`Server ready at ${url} 🚀🚀`);
      })
      .catch((err) => console.log(err));
  })
  .catch((err) => console.log(err));
