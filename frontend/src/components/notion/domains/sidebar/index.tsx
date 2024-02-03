import { memo } from "react";

import { PageList } from "@/components/notion/domains/page-list";
import { Page } from "@/graphql/generated";
import { Result } from "@/types";

export interface SidebarProps {
  pageListResult: Result<{ pages: Pick<Page, "id" | "title">[] }>;
  onClickAddPage: () => void;
  // TODO: value object
  onClickRemovePageButton: (id: string) => void;
}

export const Sidebar = memo((props: SidebarProps) => {
  return (
    <aside>
      <PageList
        result={props.pageListResult}
        onClickAddPage={props.onClickAddPage}
        onClickRemovePageButton={props.onClickRemovePageButton}
      />
    </aside>
  );
});
