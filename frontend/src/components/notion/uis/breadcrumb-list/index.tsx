import Link from "next/link";
import { memo } from "react";

import { Li, Ol, Slash } from "./styles";

import { untitledPageLabel } from "@/models/notion/page";
import { routes } from "@/routes";

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
            <Link
              href={routes.notion.page.show(a.id)}
              style={{ padding: "2px 6px" }}
            >
              {a.name || untitledPageLabel}
            </Link>
            {i !== props.ancestors.length - 1 && <Slash>/</Slash>}
          </Li>
        ))}
      </Ol>
    </nav>
  );
});
