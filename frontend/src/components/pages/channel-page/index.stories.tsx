import { Meta, StoryObj } from "@storybook/react";

import { ChannelPagePresenter, ChannelPagePresenterProps } from "./presenter";

import { defaultProps as channelListDefaultProps } from "@/components/channel-list/index.stories";

export default {
  component: ChannelPagePresenter,
  excludeStories: ["defaultProps"],
} as Meta<ChannelPagePresenterProps>;

export const defaultProps: ChannelPagePresenterProps = {
  channels: channelListDefaultProps.channels,
};

export const Default: StoryObj = {
  render: () => {
    return <ChannelPagePresenter {...defaultProps} />;
  },
};
