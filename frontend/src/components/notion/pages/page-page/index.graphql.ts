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

export const ListAncestorPages = gql`
  query ListAncestorPages($id: PageId!) {
    listAncestorPages(id: $id) {
      __typename
      ... on ListPages {
        items {
          id
          title
        }
      }
    }
  }
`;
