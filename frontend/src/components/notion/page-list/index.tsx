import { useCallback } from "react";

import { PageListPresenter } from "./presenter";

import { useAddPageMutation, useListPageQuery } from "@/graphql/generated";

export const PageList: React.FC = () => {
  const listPageResult = useListPageQuery();

  const [addPageMutation] = useAddPageMutation();

  const onClickAddPage = useCallback(() => {
    addPageMutation({ variables: { title: "", text: "" } });
  }, [addPageMutation]);

  if (listPageResult.data == null) {
    return <div>loading...</div>;
  }

  switch (listPageResult.data.listPage.__typename) {
    case "ListPage":
      return (
        <PageListPresenter
          pages={listPageResult.data.listPage.items}
          onClickAddPage={onClickAddPage}
        />
      );
    case "GraphQLError":
      // TODO
      throw new Error();
    default:
      // TODO: satisfies
      return listPageResult.data.listPage;
  }
};
