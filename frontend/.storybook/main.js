const path = require("path");

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-actions",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-links",
  ],
  framework: "@storybook/nextjs",
  webpackFinal: async (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "../src");

    return config;
  },
};
