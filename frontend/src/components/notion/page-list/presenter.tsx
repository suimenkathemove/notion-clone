import { memo } from "react";

import { Page } from "@/graphql/generated";
import { untitledPageLabel } from "@/models/notion/page";

export type PageListPresenterProps = {
  pages: Pick<Page, "id" | "title">[];
  onClickAddPage: () => void;
};

export const PageListPresenter = memo<PageListPresenterProps>((props) => {
  return (
    <div>
      {props.pages.map((p) => (
        <div key={p.id}>{p.title || untitledPageLabel}</div>
      ))}
      <button onClick={props.onClickAddPage}>+ Add a page</button>
    </div>
  );
});
