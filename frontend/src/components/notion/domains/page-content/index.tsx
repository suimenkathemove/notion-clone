import { memo } from "react";

import { Page } from "@/graphql/generated";

export interface PageContentProps {
  title: Page["title"];
  text: Page["text"];
}

export const PageContent = memo((props: PageContentProps) => {
  return (
    <div>
      <div>{props.title}</div>
      <div>{props.text}</div>
    </div>
  );
});
