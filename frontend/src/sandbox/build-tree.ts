interface Node {
  id: string;
  name: string;
}

interface NodeRelationship {
  ancestor: string;
  descendant: string;
  weight: number;
}

interface Tree {
  id: string;
  name: string;
  children: Tree[];
}

const buildTree = (
  nodes: Node[],
  parentChildRelationships: NodeRelationship[],
  rootId: string,
): Tree => {
  const treeMap = new Map<string, Tree>(
    nodes.map((n) => [n.id, { ...n, children: [] }]),
  );

  parentChildRelationships.forEach((r) => {
    const parent = treeMap.get(r.ancestor)!;
    const child = treeMap.get(r.descendant)!;
    parent.children.push(child);
  });

  return treeMap.get(rootId)!;
};

export const logBuildTree = () => {
  const nodes: Node[] = [
    {
      id: "1",
      name: "1",
    },
    {
      id: "1-1",
      name: "1-1",
    },
    {
      id: "1-2",
      name: "1-2",
    },
    {
      id: "1-3",
      name: "1-3",
    },
    {
      id: "1-1-1",
      name: "1-1-1",
    },
  ];
  const parentChildRelationships: NodeRelationship[] = [
    {
      ancestor: "1",
      descendant: "1-1",
      weight: 1,
    },
    {
      ancestor: "1",
      descendant: "1-2",
      weight: 1,
    },
    {
      ancestor: "1",
      descendant: "1-3",
      weight: 1,
    },
    {
      ancestor: "1-1",
      descendant: "1-1-1",
      weight: 1,
    },
  ];
  const tree = buildTree(nodes, parentChildRelationships, "1");
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(tree, null, 2));
};
