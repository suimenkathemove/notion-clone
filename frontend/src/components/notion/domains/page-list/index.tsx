import { memo } from "react";

import { Page } from "@/graphql/generated";
import { untitledPageLabel } from "@/models/notion/page";
import { Result } from "@/types";

export interface PageListProps {
  result: Result<{ pages: Pick<Page, "id" | "title">[] }>;
  onClickAddPage: () => void;
  // TODO: value object
  onClickRemovePageButton: (id: string) => void;
}

export const PageList = memo((props: PageListProps) => {
  switch (props.result.type) {
    case "loading":
      return <div>loading...</div>;
    case "ok":
      return (
        <div>
          <ul>
            {props.result.data.pages.map((p) => (
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
    case "err":
      return <div>error</div>;
    default:
      return props.result satisfies never;
  }
});
