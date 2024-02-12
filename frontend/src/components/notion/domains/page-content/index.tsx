import { memo, useCallback, useRef } from "react";

import { Container, ContentContainer, H1, HeaderContainer } from "./styles";

import { Page } from "@/graphql/generated";

export interface PageContentProps {
  title: Page["title"];
  onChangeTitle: (title: string) => Promise<void>;
  text: Page["text"];
}

export const PageContent = memo((props: PageContentProps) => {
  const titleRef = useRef(props.title);
  const onInput: React.FormEventHandler<HTMLHeadingElement> = useCallback(
    async (event) => {
      const value = event.currentTarget.textContent ?? "";
      await props.onChangeTitle(value);
    },
    [props],
  );

  return (
    <Container>
      <HeaderContainer>
        <H1 contentEditable suppressContentEditableWarning onInput={onInput}>
          {titleRef.current}
        </H1>
      </HeaderContainer>
      <ContentContainer>{props.text}</ContentContainer>
    </Container>
  );
});
