import { useCallback } from "react";

import { PageListPresenter } from "./presenter";

import {
  useAddPageMutation,
  useListPageQuery,
  useRemovePageMutation,
} from "@/graphql/generated";

export const PageList: React.FC = () => {
  const listPageResult = useListPageQuery();

  const [addPage] = useAddPageMutation();
  const onClickAddPage = useCallback(() => {
    addPage({ variables: { title: "", text: "" } });
  }, [addPage]);

  const [removePage] = useRemovePageMutation();
  const onClickRemovePageButton = useCallback(
    // TODO: value object
    (id: string) => {
      removePage({ variables: { id } });
    },
    [removePage],
  );

  if (listPageResult.data == null) {
    return <div>loading...</div>;
  }

  switch (listPageResult.data.listPage.__typename) {
    case "ListPage":
      return (
        <PageListPresenter
          pages={listPageResult.data.listPage.items}
          onClickAddPage={onClickAddPage}
          onClickRemovePageButton={onClickRemovePageButton}
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
