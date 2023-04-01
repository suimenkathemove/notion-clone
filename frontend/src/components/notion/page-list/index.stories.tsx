import { Meta, StoryObj } from "@storybook/react";

import { PageListPresenter, PageListPresenterProps } from "./presenter";

export default {
  component: PageListPresenter,
  excludeStories: ["defaultProps"],
} as Meta<PageListPresenterProps>;

export const defaultProps: PageListPresenterProps = {
  pages: [
    { id: "1", title: "page1" },
    { id: "2", title: "page2" },
  ],
  onClickAddPage: () => {},
};

export const Default: StoryObj = {
  render: () => {
    return <PageListPresenter {...defaultProps} />;
  },
};
