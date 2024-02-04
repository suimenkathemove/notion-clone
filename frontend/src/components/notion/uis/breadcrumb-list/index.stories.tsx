import { Meta, StoryObj } from "@storybook/react";

import { BreadcrumbList, BreadcrumbListProps } from ".";

export default {
  component: BreadcrumbList,
  excludeStories: ["defaultProps"],
} as Meta<typeof BreadcrumbList>;

export const defaultProps: BreadcrumbListProps = {
  ancestors: [
    { id: "1", name: "1" },
    { id: "2", name: "2" },
    { id: "3", name: "3" },
  ],
};

export const Default: StoryObj = {
  render: () => {
    return <BreadcrumbList {...defaultProps} />;
  },
};
