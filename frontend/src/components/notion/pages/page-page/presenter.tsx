import { memo } from "react";

import { Header, HeaderProps } from "@/components/notion/domains/header";
import {
  PageContent,
  PageContentProps,
} from "@/components/notion/domains/page-content";
import { Sidebar, SidebarProps } from "@/components/notion/domains/sidebar";
import { Layout } from "@/components/notion/layout";

export type PagePagePresenterProps = {
  pageListResult: SidebarProps["pageListResult"];
  onClickAddPage: SidebarProps["onClickAddPage"];
  onClickRemovePageButton: SidebarProps["onClickRemovePageButton"];
  ancestors: HeaderProps["ancestors"];
  title: PageContentProps["title"];
  onChangeTitle: PageContentProps["onChangeTitle"];
  text: PageContentProps["text"];
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
        <PageContent
          title={props.title}
          onChangeTitle={props.onChangeTitle}
          text={props.text}
        />
      }
    />
  );
});
