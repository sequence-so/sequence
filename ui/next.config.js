const withPlugins = require("next-compose-plugins");
const withImages = require("next-images");
module.exports = withPlugins(
  [
    [
      withImages,
      {
        future: {
          webpack5: true,
        },
      },
    ],
  ],
  {
    poweredByHeader: false,
    // webpack: (config, { isServer, dev, webpack }) => {
    //   config.optimization = {
    //     minimize: false,
    //   };

    //   config.output.hotUpdateMainFilename =
    //     "static/webpack/[fullhash].[runtime].hot-update.json";

    //   if (!isServer) {
    //     config.resolve.fallback.fs = false;
    //   }

    //   return config;
    // },
  }
);
