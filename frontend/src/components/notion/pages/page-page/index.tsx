import { NextPage } from "next";
import { useMemo } from "react";

import { PagePagePresenter, PagePagePresenterProps } from "./presenter";

import {
  useGetPageInPagePageQuery,
  useListAncestorPagesQuery,
} from "@/graphql/generated";
import { useRouterQuery } from "@/hooks/use-router-query";

export const PagePage: NextPage = () => {
  const routerQuery = useRouterQuery(["page-id"]);

  const getPageInPagePageResult = useGetPageInPagePageQuery(
    routerQuery.isReady
      ? { variables: { id: routerQuery.query["page-id"] } }
      : { skip: true },
  );

  const listAncestorPagesResult = useListAncestorPagesQuery(
    routerQuery.isReady
      ? { variables: { id: routerQuery.query["page-id"] } }
      : { skip: true },
  );
  // TODO: error handling?
  const ancestors = useMemo<PagePagePresenterProps["ancestors"]>(
    () =>
      listAncestorPagesResult.data?.listAncestorPages.__typename === "ListPages"
        ? listAncestorPagesResult.data.listAncestorPages.items.map((item) => ({
            id: item.id,
            name: item.title,
          }))
        : [],
    [listAncestorPagesResult.data?.listAncestorPages],
  );

  if (getPageInPagePageResult.data == null) return <div>loading...</div>;

  switch (getPageInPagePageResult.data.getPage.__typename) {
    case "Page":
      return (
        <PagePagePresenter
          ancestors={ancestors}
          title={getPageInPagePageResult.data.getPage.title}
          text={getPageInPagePageResult.data.getPage.text}
        />
      );
    case "GraphQLError":
      // TODO
      throw new Error();
    default:
      return getPageInPagePageResult.data.getPage satisfies never;
  }
};
