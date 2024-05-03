import { Meta, StoryObj } from "@storybook/react";

import { PageList, PageListProps } from ".";

import { PageId } from "@/graphql/generated";

export default {
  component: PageList,
  excludeStories: ["defaultProps"],
} as Meta<PageListProps>;

export const defaultProps: PageListProps = {
  result: {
    type: "ok",
    data: {
      pages: [
        { id: "1" as PageId, title: "page1" },
        { id: "2" as PageId, title: "page2" },
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
