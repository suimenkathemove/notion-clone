import { memo, useCallback, useEffect, useRef } from "react";

import { Container, Content, HeaderContainer, Text, Title } from "./styles";

import { Page } from "@/graphql/generated";

export interface PageContentProps {
  title: Page["title"];
  onChangeTitle: (title: string) => Promise<void>;
  text: Page["text"];
  onChangeText: (text: string) => Promise<void>;
}

export const PageContent = memo((props: PageContentProps) => {
  const titleElRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (titleElRef.current == null) return;
    titleElRef.current.textContent = props.title;
  }, [props.title]);
  const onInputTitle: React.FormEventHandler<HTMLHeadingElement> = useCallback(
    async (event) => {
      const value = event.currentTarget.textContent ?? "";
      await props.onChangeTitle(value);
    },
    [props],
  );

  const textElRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (textElRef.current == null) return;
    textElRef.current.textContent = props.text;
  }, [props.text]);
  const onInputText: React.FormEventHandler<HTMLDivElement> = useCallback(
    async (event) => {
      const value = event.currentTarget.textContent ?? "";
      await props.onChangeText(value);
    },
    [props],
  );

  return (
    <Container>
      <Content>
        <HeaderContainer>
          <Title
            contentEditable
            suppressContentEditableWarning
            onInput={onInputTitle}
            ref={titleElRef}
          />
        </HeaderContainer>
        <Text
          contentEditable
          suppressContentEditableWarning
          onInput={onInputText}
          ref={textElRef}
        />
      </Content>
    </Container>
  );
});
