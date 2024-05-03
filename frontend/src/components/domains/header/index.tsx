import { memo } from "react";

import { StyledHeader } from "./styles";

import {
  BreadcrumbList,
  BreadcrumbListProps,
} from "@/components/uis/breadcrumb-list";

export interface HeaderProps {
  ancestors: BreadcrumbListProps["ancestors"];
}

export const Header = memo((props: HeaderProps) => {
  return (
    <StyledHeader>
      <BreadcrumbList ancestors={props.ancestors} />
    </StyledHeader>
  );
});
