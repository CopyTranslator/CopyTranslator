module.exports = {
  module: {
    rules: [
      {
        loader: "babel-loader",
        test: "/.js|.jsx|.ts|.tsx$/",
        exclude: /node_modules/,
      },
    ],
  },
};
