import styled from "styled-components";

const SIDEBAR = "sidebar";
const MAIN = "main";

export const Container = styled.div`
  display: grid;
  grid-template: "${SIDEBAR} ${MAIN}";
  grid-template-columns: 240px auto;
  height: 100%;
`;

export const SidebarWrapper = styled.div`
  grid-area: ${SIDEBAR};
`;

export const MainWrapper = styled.div`
  grid-area: ${MAIN};
`;
