import { useCallback } from "react";

import { PageListPresenter } from "./presenter";

import { useCreatePageMutation, useListPageQuery } from "@/graphql/generated";

export const PageList: React.FC = () => {
  const listPageResult = useListPageQuery();

  const [createPageMutation] = useCreatePageMutation();

  const onClickAddPage = useCallback(() => {
    createPageMutation({ variables: { title: "", text: "" } });
  }, [createPageMutation]);

  if (listPageResult.data == null) {
    return <div>loading...</div>;
  }

  return (
    <PageListPresenter
      pages={listPageResult.data.listPage}
      onClickAddPage={onClickAddPage}
    />
  );
};
