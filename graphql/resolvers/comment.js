const { AuthenticationError, UserInputError } = require("apollo-server");
const checkAuth = require("../../utils/check-auth");
const Post = require("../../models/Post");

module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const user = checkAuth(context);
      if (body.trim() === "") {
        throw new UserInputError("Empty comment", {
          errors: {
            body: "comment must not be empty",
          },
        });
      }
      const post = await Post.findById(postId);
      if (post) {
        post.comments.unshift({
          body,
          createdAt: new Date().toISOString(),
          username: user.username,
        });
        await post.save();
        return post;
      } else {
        throw new UserInputError("post not found");
      }
    },
    deleteComment: async (_, { postId, commentId }, context) => {
      const user = checkAuth(context);
      const post = await Post.findById(postId);
      if (post) {
        const commentIndex = post.comments.findIndex((c) => c.id === commentId);
        if (post.comments[commentIndex].username === user.username) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError("action not allowed");
        }
      } else {
        throw new UserInputError("post not found");
      }
    },
  },
};
