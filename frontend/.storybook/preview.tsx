import "destyle.css";
import "@/styles/global.css";
import "./global.css";

import { Preview } from "@storybook/react";

export default {
  decorators: [
    (Story) => (
      // @ts-expect-error
      <Story />
    ),
  ],
} satisfies Preview;
