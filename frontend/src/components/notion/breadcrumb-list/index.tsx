import { Li, Ol } from "./styles";

interface Node {
  id: string;
  name: string;
}

export interface BreadcrumbListProps {
  ancestors: Node[];
}

export const BreadcrumbList: React.VFC<BreadcrumbListProps> = (props) => {
  return (
    <nav>
      <Ol>
        {props.ancestors.map((a, i) => (
          <Li key={a.id}>
            <span>{a.name}</span>
            {i !== props.ancestors.length - 1 && <span>&gt;</span>}
          </Li>
        ))}
      </Ol>
    </nav>
  );
};
