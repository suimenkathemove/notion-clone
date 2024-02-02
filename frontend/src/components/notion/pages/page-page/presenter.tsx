import { memo } from "react";

import { PageList } from "@/components/notion/domains/page-list";
import {
  BreadcrumbList,
  BreadcrumbListProps,
} from "@/components/notion/uis/breadcrumb-list";
import { Page } from "@/graphql/generated";
import { Result } from "@/types";

export type PagePagePresenterProps = {
  pageListResult: Result<{ pages: Pick<Page, "id" | "title">[] }>;
  onClickAddPage: () => void;
  // TODO: value object
  onClickRemovePageButton: (id: string) => void;
  ancestors: BreadcrumbListProps["ancestors"];
  title: string;
  text: string;
};

export const PagePagePresenter = memo((props: PagePagePresenterProps) => {
  return (
    <div>
      <PageList
        result={props.pageListResult}
        onClickAddPage={props.onClickAddPage}
        onClickRemovePageButton={props.onClickRemovePageButton}
      />
      <div>
        <BreadcrumbList ancestors={props.ancestors} />
        <div>{props.title}</div>
        <div>{props.text}</div>
      </div>
    </div>
  );
});
