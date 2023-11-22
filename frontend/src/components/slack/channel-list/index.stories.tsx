import { Meta, StoryObj } from "@storybook/react";

import { ChannelList, ChannelListProps } from ".";

export default {
  component: ChannelList,
  excludeStories: ["defaultProps"],
} as Meta<ChannelListProps>;

export const defaultProps: ChannelListProps = {
  channels: [
    { id: 1, name: "foo" },
    { id: 2, name: "bar" },
  ],
};

export const Default: StoryObj = {
  render: () => {
    return <ChannelList {...defaultProps} />;
  },
};
