import { gql } from "@apollo/client";

export const listPage = gql`
  query listPage {
    listPage {
      id
      title
      text
    }
  }
`;
