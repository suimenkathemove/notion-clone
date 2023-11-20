import { gql } from "@apollo/client";

export const GetPageInPagePage = gql`
  query GetPageInPagePage($id: PageId!) {
    getPage(id: $id) {
      __typename
      ... on Page {
        id
        title
        text
      }
    }
  }
`;
