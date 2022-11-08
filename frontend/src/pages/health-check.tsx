import { gql, useQuery } from "@apollo/client";
import { NextPage } from "next";

const healthCheck = gql`
  {
    healthCheck
  }
`;

const HealthCheck: NextPage = () => {
  const healthCheckResult = useQuery(healthCheck);

  return <div>{healthCheckResult.data?.healthCheck}</div>;
};

export default HealthCheck;
