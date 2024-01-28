import { Meta, StoryObj } from "@storybook/react";
import styled from "styled-components";

import { Layout, LayoutProps } from ".";

export default {
  component: Layout,
} satisfies Meta<LayoutProps>;

const Sidebar = styled.aside`
  height: 100%;
  background-color: red;
`;

const Main = styled.main`
  height: 100%;
  background-color: blue;
`;

export const Default: StoryObj = {
  render: () => {
    return <Layout sidebar={<Sidebar />} main={<Main />} />;
  },
};
