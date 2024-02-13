import { memo, useCallback, useRef } from "react";

import { Container, ContentContainer, H1, HeaderContainer } from "./styles";

import { Page } from "@/graphql/generated";

export interface PageContentProps {
  title: Page["title"];
  onChangeTitle: (title: string) => Promise<void>;
  text: Page["text"];
  onChangeText: (text: string) => Promise<void>;
}

export const PageContent = memo((props: PageContentProps) => {
  const titleRef = useRef(props.title);
  const onInputTitle: React.FormEventHandler<HTMLHeadingElement> = useCallback(
    async (event) => {
      const value = event.currentTarget.textContent ?? "";
      await props.onChangeTitle(value);
    },
    [props],
  );

  const textRef = useRef(props.text);
  const onInputText: React.FormEventHandler<HTMLDivElement> = useCallback(
    async (event) => {
      const value = event.currentTarget.textContent ?? "";
      await props.onChangeText(value);
    },
    [props],
  );

  return (
    <Container>
      <HeaderContainer>
        <H1
          contentEditable
          suppressContentEditableWarning
          onInput={onInputTitle}
        >
          {titleRef.current}
        </H1>
      </HeaderContainer>
      <ContentContainer
        contentEditable
        suppressContentEditableWarning
        onInput={onInputText}
      >
        {textRef.current}
      </ContentContainer>
    </Container>
  );
});
