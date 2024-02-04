import { memo } from "react";

import { Container, ContentContainer, H1, HeaderContainer } from "./styles";

import { Page } from "@/graphql/generated";

export interface PageContentProps {
  title: Page["title"];
  text: Page["text"];
}

export const PageContent = memo((props: PageContentProps) => {
  return (
    <Container>
      <HeaderContainer>
        <H1>{props.title}</H1>
      </HeaderContainer>
      <ContentContainer>{props.text}</ContentContainer>
    </Container>
  );
});
