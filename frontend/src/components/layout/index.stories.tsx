import { Meta, StoryObj } from "@storybook/react";
import styled from "styled-components";

import { Layout, LayoutProps } from ".";

export default {
  component: Layout,
} satisfies Meta<LayoutProps>;

const Sidebar = styled.nav`
  height: 100%;
  background-color: red;
`;

const Header = styled.header`
  height: 100%;
  background-color: blue;
`;

const Main = styled.main`
  height: 100%;
  background-color: yellow;
`;

export const Default: StoryObj = {
  render: () => {
    return <Layout sidebar={<Sidebar />} header={<Header />} main={<Main />} />;
  },
};
