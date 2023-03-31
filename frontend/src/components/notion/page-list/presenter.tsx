import { memo } from "react";

import { Page } from "@/graphql/generated";

export type PageListPresenterProps = {
  pages: Pick<Page, "id" | "title">[];
};

export const PageListPresenter = memo<PageListPresenterProps>((props) => {
  return (
    <div>
      {props.pages.map((p) => (
        <div key={p.id}>{p.title}</div>
      ))}
    </div>
  );
});
