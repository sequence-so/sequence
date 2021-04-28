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
    webpack: (config, options) => {
      config.optimization = {
        minimize: false,
      };

      return config;
    },
  }
);
