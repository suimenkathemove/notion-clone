import { Meta, StoryObj } from "@storybook/react";

import { ChannelPagePresenter, ChannelPagePresenterProps } from "./presenter";

import { defaultProps as channelListDefaultProps } from "@/components/channel-list/index.stories";
import { defaultProps as chatRoomDefaultProps } from "@/components/chat-room/index.stories";

export default {
  component: ChannelPagePresenter,
  excludeStories: ["defaultProps"],
} as Meta<ChannelPagePresenterProps>;

export const defaultProps: ChannelPagePresenterProps = {
  channels: channelListDefaultProps.channels,
  chatRoomProps: chatRoomDefaultProps,
};

export const Default: StoryObj = {
  render: () => {
    return <ChannelPagePresenter {...defaultProps} />;
  },
};
