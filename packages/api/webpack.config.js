const nodeExternals = require("webpack-node-externals");
const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  target: "node",
  entry: {
    app: "./src/server.ts",
    cron: "./scripts/cronDaemon.ts",
  },
  devtool: "inline-source-map",
  externals: [nodeExternals()],
  // See https://github.com/sequence-so/sequence/issues/16
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              projectReferences: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      src: path.resolve(__dirname, "src/"),
    },
    plugins: [new TsconfigPathsPlugin()],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
};
