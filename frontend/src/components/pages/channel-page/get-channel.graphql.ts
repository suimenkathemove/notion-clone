import { gql } from "@apollo/client";

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
