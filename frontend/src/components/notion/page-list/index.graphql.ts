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

export const createPage = gql`
  mutation createPage($title: String!, $text: String!) {
    createPage(title: $title, text: $text) {
      id
      title
    }
  }
`;
