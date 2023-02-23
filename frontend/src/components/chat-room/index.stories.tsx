import { Meta, StoryObj } from "@storybook/react";

import { ChatRoom, ChatRoomProps } from "./";

export default {
  component: ChatRoom,
  excludeStories: ["defaultProps"],
} as Meta<ChatRoomProps>;

export const defaultProps: ChatRoomProps = {
  threads: [],
};

export const Default: StoryObj = {
  render: () => {
    return <ChatRoom {...defaultProps} />;
  },
};
