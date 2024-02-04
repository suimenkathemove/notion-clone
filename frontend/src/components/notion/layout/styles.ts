import styled from "styled-components";

const SIDEBAR = "sidebar";
const CONTENT = "content";
const HEADER = "header";
const MAIN = "main";

export const Container = styled.div`
  display: grid;
  grid-template: "${SIDEBAR} ${CONTENT}";
  grid-template-columns: 240px auto;
  height: 100%;
`;

export const SidebarWrapper = styled.div`
  grid-area: ${SIDEBAR};
  background-color: rgb(251 251 250);
  box-shadow: rgba(0 0 0 2.4%) -1px 0 0 0 inset;
`;

export const Content = styled.div`
  display: grid;
  grid-area: ${CONTENT};
  grid-template: "${HEADER}" "${MAIN}";
  grid-template-rows: 45px auto;
  height: 100%;
  background-color: white;
`;

export const HeaderWrapper = styled.div`
  grid-area: ${HEADER};
`;

export const MainWrapper = styled.div`
  grid-area: ${MAIN};
`;
