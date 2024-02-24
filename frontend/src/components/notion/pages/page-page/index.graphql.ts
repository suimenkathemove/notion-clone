import { gql } from "@apollo/client";

export const ListRootPages = gql`
  query ListRootPages {
    listRootPages {
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

export const ListChildrenPages = gql`
  query ListChildrenPages($id: PageId!) {
    listChildrenPages(id: $id) {
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

export const AddPage = gql`
  mutation AddPage($parentId: PageId, $addPage: AddPage!) {
    addPage(parentId: $parentId, addPage: $addPage) {
      ... on Page {
        id
        title
      }
    }
  }
`;

export const UpdatePage = gql`
  mutation UpdatePage($id: PageId!, $updatePage: UpdatePage!) {
    updatePage(id: $id, updatePage: $updatePage) {
      ... on Page {
        id
        title
        text
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

export const MovePage = gql`
  mutation MovePage($id: PageId!, $target: MoveTarget!) {
    movePage(id: $id, target: $target) {
      ... on MovePage {
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
