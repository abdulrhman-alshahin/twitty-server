const postresolvers = require("./post");
const userresolvers = require("./user");
const commentresolvers = require("./comment");

module.exports = {
  Post: {
    likesCount: (parent) => parent.likes.length,
    commentsCount: (parent) => parent.comments.length,
  },
  Query: {
    ...postresolvers.Query,
  },
  Mutation: {
    ...userresolvers.Mutation,
    ...postresolvers.Mutation,
    ...commentresolvers.Mutation,
  },
};
