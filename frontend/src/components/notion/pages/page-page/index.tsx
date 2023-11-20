import { NextPage } from "next";

import { PagePagePresenter } from "./presenter";

import { useGetPageInPagePageQuery } from "@/graphql/generated";
import { useRouterQuery } from "@/hooks/use-router-query";

export const PagePage: NextPage = () => {
  const routerQuery = useRouterQuery(["page-id"]);

  const getPageInPagePageResult = useGetPageInPagePageQuery(
    routerQuery.isReady
      ? { variables: { id: routerQuery.query["page-id"] } }
      : { skip: true },
  );

  if (getPageInPagePageResult.data == null) return <div>loading...</div>;

  switch (getPageInPagePageResult.data.getPage.__typename) {
    case "Page":
      return (
        <PagePagePresenter
          title={getPageInPagePageResult.data.getPage.title}
          text={getPageInPagePageResult.data.getPage.text}
        />
      );
    case "GraphQLError":
      // TODO
      throw new Error();
    default:
      // TODO: satisfies
      return getPageInPagePageResult.data.getPage;
  }
};
