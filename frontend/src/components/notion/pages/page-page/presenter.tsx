import { memo } from "react";

import { PageList } from "@/components/notion/domains/page-list";
import {
  BreadcrumbList,
  BreadcrumbListProps,
} from "@/components/notion/uis/breadcrumb-list";

export type PagePagePresenterProps = {
  ancestors: BreadcrumbListProps["ancestors"];
  title: string;
  text: string;
};

export const PagePagePresenter = memo<PagePagePresenterProps>((props) => {
  return (
    <div>
      <PageList />
      <div>
        <BreadcrumbList ancestors={props.ancestors} />
        <div>{props.title}</div>
        <div>{props.text}</div>
      </div>
    </div>
  );
});
