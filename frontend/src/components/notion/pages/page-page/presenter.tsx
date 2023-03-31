import { memo } from "react";

import { PageList } from "@/components/notion/page-list";

export type PagePagePresenterProps = {
  title: string;
  text: string;
};

export const PagePagePresenter = memo<PagePagePresenterProps>((props) => {
  return (
    <div>
      <PageList />
      <div>
        <div>{props.title}</div>
        <div>{props.text}</div>
      </div>
    </div>
  );
});
