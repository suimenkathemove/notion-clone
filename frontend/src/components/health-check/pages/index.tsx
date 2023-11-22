import { NextPage } from "next";

import { useHealthCheckQuery } from "@/graphql/generated";

export const HealthCheck: NextPage = () => {
  const healthCheckResult = useHealthCheckQuery();

  return <div>{healthCheckResult.data?.healthCheck}</div>;
};
