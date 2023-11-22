import { Meta, StoryObj } from "@storybook/react";

import { PagePagePresenter, PagePagePresenterProps } from "./presenter";

export default {
  component: PagePagePresenter,
  excludeStories: ["defaultProps"],
} as Meta<PagePagePresenterProps>;

export const defaultProps: PagePagePresenterProps = {
  ancestors: [
    { id: "parent", name: "parent" },
    { id: "title", name: "title" },
  ],
  title: "title",
  text: "text",
};

export const Default: StoryObj = {
  render: () => {
    return <PagePagePresenter {...defaultProps} />;
  },
};
