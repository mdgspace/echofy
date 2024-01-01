module.exports = {
    images: {
      domains: ['avatars.slack-edge.com'], // Add the domain(s) from which you want to load images
    },

    webpack(config) {
      config.module.rules.push({
        test: /\.mp3$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/sounds/[hash][ext][query]',
        },
      });
  
      return config;
    },
  };
  