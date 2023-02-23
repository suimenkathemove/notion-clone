import { gql } from "@apollo/client";

export const listChannel = gql`
  query listChannel {
    listChannel {
      id
      name
    }
  }
`;
