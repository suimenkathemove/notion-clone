import { gql } from "@apollo/client";

export const listChannel = gql`
  query listChannel {
    listChannel {
      id
      name
    }
  }
`;

export const getChannel = gql`
  query getChannel($id: ChannelId!) {
    getChannel(id: $id) {
      id
      name
      threads {
        id
        messages {
          id
          text
        }
      }
    }
  }
`;

export const addMessage = gql`
  mutation addMessage($channelId: ChannelId!, $messageText: String!) {
    addMessage(channelId: $channelId, messageText: $messageText) {
      id
      text
    }
  }
`;
