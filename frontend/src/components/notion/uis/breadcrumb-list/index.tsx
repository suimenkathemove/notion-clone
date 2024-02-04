import { memo } from "react";

import { A, Li, Ol, Slash } from "./styles";

interface Node {
  id: string;
  name: string;
}

export interface BreadcrumbListProps {
  ancestors: Node[];
}

export const BreadcrumbList = memo((props: BreadcrumbListProps) => {
  return (
    <nav>
      <Ol>
        {props.ancestors.map((a, i) => (
          <Li key={a.id}>
            <A>{a.name}</A>
            {i !== props.ancestors.length - 1 && <Slash>/</Slash>}
          </Li>
        ))}
      </Ol>
    </nav>
  );
});
