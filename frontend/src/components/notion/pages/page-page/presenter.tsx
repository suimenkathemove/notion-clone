import { memo } from "react";

import { Header, HeaderProps } from "@/components/notion/domains/header";
import { Sidebar } from "@/components/notion/domains/sidebar";
import { Layout } from "@/components/notion/layout";
import { Page } from "@/graphql/generated";
import { Result } from "@/types";

export type PagePagePresenterProps = {
  pageListResult: Result<{ pages: Pick<Page, "id" | "title">[] }>;
  onClickAddPage: () => void;
  // TODO: value object
  onClickRemovePageButton: (id: string) => void;
  ancestors: HeaderProps["ancestors"];
  title: string;
  text: string;
};

export const PagePagePresenter = memo((props: PagePagePresenterProps) => {
  return (
    <Layout
      sidebar={
        <Sidebar
          pageListResult={props.pageListResult}
          onClickAddPage={props.onClickAddPage}
          onClickRemovePageButton={props.onClickRemovePageButton}
        />
      }
      header={<Header ancestors={props.ancestors} />}
      main={
        <div>
          <div>{props.title}</div>
          <div>{props.text}</div>
        </div>
      }
    />
  );
});
