import { Meta, StoryObj } from "@storybook/react";

import { PagePagePresenter, PagePagePresenterProps } from "./presenter";

import { defaultProps as pageListDefaultProps } from "@/components/domains/page-list/index.stories";

export default {
  component: PagePagePresenter,
  excludeStories: ["defaultProps"],
} as Meta<PagePagePresenterProps>;

export const defaultProps: PagePagePresenterProps = {
  ...pageListDefaultProps,
  pageListResult: pageListDefaultProps.result,
  ancestors: [
    { id: "parent", name: "parent" },
    { id: "title", name: "title" },
  ],
  title: "title",
  onChangeTitle: async () => {},
  text: "text",
  onChangeText: async () => {},
};

export const Default: StoryObj = {
  render: () => {
    return <PagePagePresenter {...defaultProps} />;
  },
};
