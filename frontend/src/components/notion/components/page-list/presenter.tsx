import { memo } from "react";

import { Page } from "@/graphql/generated";
import { untitledPageLabel } from "@/models/notion/page";

export type PageListPresenterProps = {
  pages: Pick<Page, "id" | "title">[];
  onClickAddPage: () => void;
  // TODO: value object
  onClickRemovePageButton: (id: string) => void;
};

export const PageListPresenter = memo<PageListPresenterProps>((props) => {
  return (
    <div>
      <ul>
        {props.pages.map((p) => (
          <li key={p.id}>
            <span>{p.title || untitledPageLabel}</span>
            <button
              onClick={() => {
                props.onClickRemovePageButton(p.id);
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button onClick={props.onClickAddPage}>+ Add a page</button>
    </div>
  );
});
