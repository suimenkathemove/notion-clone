import { gql } from "@apollo/client";

export const ListRootPages = gql`
  query ListRootPages {
    listRootPages {
      __typename
      ... on ListPages {
        items {
          id
          title
          text
        }
      }
    }
  }
`;

export const AddPage = gql`
  mutation AddPage($title: String!, $text: String!) {
    addPage(title: $title, text: $text) {
      ... on Page {
        id
        title
      }
    }
  }
`;

export const RemovePage = gql`
  mutation RemovePage($id: PageId!) {
    removePage(id: $id) {
      ... on RemovePage {
        id
      }
    }
  }
`;
