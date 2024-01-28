import { Container, MainWrapper, SidebarWrapper } from "./styles";

export interface LayoutProps {
  sidebar: React.ReactNode;
  main: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = (props) => {
  return (
    <Container>
      <SidebarWrapper>{props.sidebar}</SidebarWrapper>
      <MainWrapper>{props.main}</MainWrapper>
    </Container>
  );
};
