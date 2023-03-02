import { Meta, StoryObj } from "@storybook/react";

import { ChatRoom, ChatRoomProps } from "./";

export default {
  component: ChatRoom,
  excludeStories: ["defaultProps"],
} as Meta<ChatRoomProps>;

export const defaultProps: ChatRoomProps = {
  threads: [],
  addMessage: async () => {},
  reply: async () => {},
};

export const Default: StoryObj = {
  render: () => {
    return <ChatRoom {...defaultProps} />;
  },
};
