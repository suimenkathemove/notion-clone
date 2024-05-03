import { memo } from "react";

import {
  Container,
  Content,
  HeaderWrapper,
  MainWrapper,
  SidebarWrapper,
} from "./styles";

export interface LayoutProps {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  main: React.ReactNode;
}

export const Layout = memo((props: LayoutProps) => {
  return (
    <Container>
      <SidebarWrapper>{props.sidebar}</SidebarWrapper>
      <Content>
        <HeaderWrapper>{props.header}</HeaderWrapper>
        <MainWrapper>{props.main}</MainWrapper>
      </Content>
    </Container>
  );
});
