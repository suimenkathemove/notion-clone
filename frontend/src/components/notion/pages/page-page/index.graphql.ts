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
  mutation AddPage($parentId: PageId, $content: PageContent!) {
    addPage(parentId: $parentId, content: $content) {
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
