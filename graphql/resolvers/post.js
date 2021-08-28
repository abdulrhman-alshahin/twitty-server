const Post = require("../../models/Post");
const { AuthenticationError, UserInputError } = require("apollo-server");
const checkAuth = require("../../utils/check-auth");
module.exports = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
    getPost: async (_, { postId }) => {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("post not found");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    createPost: async (_, { body }, context) => {
      const user = checkAuth(context);
      if (body.trim() === "") {
        throw new Error("post body must not be empty");
      }
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
        commentsCount: 0,
        likesCount: 0,
        comments: [],
        likes: [],
      });
      try {
        const post = await newPost.save();
        return post;
      } catch (error) {
        throw new Error("something went wrong, please try again");
      }
    },
    deletePost: async (_, { postId }, context) => {
      const user = checkAuth(context);
      let post;
      try {
        post = await Post.findById(postId);
      } catch (error) {
        throw new Error("post not found");
      }
      if (post && user.username === post.username) {
        try {
          await Post.findByIdAndDelete(postId);
          return "post deleted successfully";
        } catch (error) {
          throw new Error("something went wrong, please try again");
        }
      } else {
        throw new AuthenticationError("action not allowed");
      }
    },
    likePost: async (_, { postId }, context) => {
      const { username } = checkAuth(context);
      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }
        await post.save();
        return post;
      } else {
        throw new UserInputError("post not found");
      }
    },
  },
};
