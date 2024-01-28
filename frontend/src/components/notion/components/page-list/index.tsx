import { useCallback } from "react";

import { PageListPresenter } from "./presenter";

import {
  useAddPageMutation,
  useListRootPagesQuery,
  useRemovePageMutation,
} from "@/graphql/generated";

export const PageList: React.FC = () => {
  const listRootPagesResult = useListRootPagesQuery();

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

  if (listRootPagesResult.data == null) {
    return <div>loading...</div>;
  }

  switch (listRootPagesResult.data.listRootPages.__typename) {
    case "ListPages":
      return (
        <PageListPresenter
          pages={listRootPagesResult.data.listRootPages.items}
          onClickAddPage={onClickAddPage}
          onClickRemovePageButton={onClickRemovePageButton}
        />
      );
    case "GraphQLError":
      // TODO
      throw new Error();
    default:
      return listRootPagesResult.data.listRootPages satisfies never;
  }
};
