import path from "path";

import { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

export default {
  stories: ["../src/**/*.stories.tsx"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-links",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    return mergeConfig(config, {
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "../src"),
        },
      },
      define: {
        "process.env": {},
      },
    });
  },
} satisfies StorybookConfig;
