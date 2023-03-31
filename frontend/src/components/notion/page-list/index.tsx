import { PageListPresenter } from "./presenter";

import { useListPageQuery } from "@/graphql/generated";

export const PageList: React.FC = () => {
  const listPageResult = useListPageQuery();

  if (listPageResult.data == null) {
    return <div>loading...</div>;
  }

  return <PageListPresenter pages={listPageResult.data.listPage} />;
};
