import { Meta, StoryObj } from "@storybook/react";

import { PagePagePresenter, PagePagePresenterProps } from "./presenter";

export default {
  component: PagePagePresenter,
  excludeStories: ["defaultProps"],
} as Meta<PagePagePresenterProps>;

export const defaultProps: PagePagePresenterProps = {
  title: "title",
  text: "text",
};

export const Default: StoryObj = {
  render: () => {
    return <PagePagePresenter {...defaultProps} />;
  },
};
