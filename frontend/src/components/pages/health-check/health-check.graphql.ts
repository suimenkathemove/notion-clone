import { gql } from "@apollo/client";

export const healthCheck = gql`
  query healthCheck {
    healthCheck
  }
`;
