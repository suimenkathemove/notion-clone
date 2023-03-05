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
  mutation addMessage($channelId: ChannelId!, $text: String!) {
    addMessage(channelId: $channelId, text: $text) {
      id
      text
    }
  }
`;

export const getThread = gql`
  query getThread($id: ThreadId!) {
    getThread(id: $id) {
      id
      messages {
        id
        text
      }
    }
  }
`;

export const reply = gql`
  mutation reply($threadId: ThreadId!, $text: String!) {
    reply(threadId: $threadId, text: $text) {
      id
      text
    }
  }
`;
