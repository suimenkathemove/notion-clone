import { memo } from "react";

import { Container, MainWrapper, SidebarWrapper } from "./styles";

export interface LayoutProps {
  sidebar: React.ReactNode;
  main: React.ReactNode;
}

export const Layout = memo((props: LayoutProps) => {
  return (
    <Container>
      <SidebarWrapper>{props.sidebar}</SidebarWrapper>
      <MainWrapper>{props.main}</MainWrapper>
    </Container>
  );
});
