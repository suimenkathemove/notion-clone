import { NextPage } from "next";
import { useCallback, useMemo } from "react";

import { PagePagePresenter, PagePagePresenterProps } from "./presenter";

import {
  useAddPageMutation,
  useGetPageInPagePageQuery,
  useListAncestorPagesQuery,
  useListRootPagesQuery,
  useRemovePageMutation,
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

  const listRootPagesResult = useListRootPagesQuery();
  const pageListResult =
    useMemo((): PagePagePresenterProps["pageListResult"] => {
      if (listRootPagesResult.data == null)
        return {
          type: "loading",
        };
      switch (listRootPagesResult.data.listRootPages.__typename) {
        case "ListPages":
          return {
            type: "ok",
            data: { pages: listRootPagesResult.data.listRootPages.items },
          };
        case "GraphQLError":
          return {
            type: "err",
            error: new Error(),
          };
        default:
          return listRootPagesResult.data.listRootPages satisfies never;
      }
    }, [listRootPagesResult.data]);

  const [addPage] = useAddPageMutation();
  const onClickAddPage = useCallback(async () => {
    await addPage({
      variables: { parentId: null, content: { title: "", text: "" } },
    });
  }, [addPage]);

  const [removePage] = useRemovePageMutation();
  const onClickRemovePageButton = useCallback(
    // TODO: value object
    async (id: string) => {
      await removePage({ variables: { id } });
    },
    [removePage],
  );

  if (getPageInPagePageResult.data == null) return <div>loading...</div>;

  switch (getPageInPagePageResult.data.getPage.__typename) {
    case "Page":
      return (
        <PagePagePresenter
          pageListResult={pageListResult}
          onClickAddPage={onClickAddPage}
          onClickRemovePageButton={onClickRemovePageButton}
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
