import { Meta, StoryObj } from "@storybook/react";

import { PageList, PageListProps } from ".";

export default {
  component: PageList,
  excludeStories: ["defaultProps"],
} as Meta<PageListProps>;

export const defaultProps: PageListProps = {
  result: {
    type: "ok",
    data: {
      pages: [
        { id: "1", title: "page1" },
        { id: "2", title: "page2" },
      ],
    },
  },
  onClickAddPage: () => {},
  onClickRemovePageButton: () => {},
};

export const Default: StoryObj = {
  render: () => {
    return <PageList {...defaultProps} />;
  },
};
