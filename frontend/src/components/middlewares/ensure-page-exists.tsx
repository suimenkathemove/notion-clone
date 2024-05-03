import { invariant } from "@suimenkathemove/utils";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { PageTree, usePageTree } from "@/global-states/page-tree";
import { useAddPageMutation } from "@/graphql/generated";
import { usePrevState } from "@/hooks/use-prev-state";
import { routes } from "@/routes";

export const EnsurePageExists: React.FC<{ children: React.ReactNode }> = (
  props,
) => {
  const { pageTree, setPageTree } = usePageTree();

  const prevPageTree = usePrevState(pageTree);

  const [addPage] = useAddPageMutation();

  const router = useRouter();

  useEffect(() => {
    void (async () => {
      const areAllPagesRemoved =
        prevPageTree != null &&
        prevPageTree.length !== 0 &&
        pageTree.length === 0;
      if (areAllPagesRemoved) {
        const result = await addPage({
          variables: { parentId: null, addPage: { title: "", text: "" } },
        });
        invariant(
          result.data?.addPage.__typename === "Page",
          "TODO: error handling",
        );
        const newTree: PageTree = pageTree.concat({
          id: result.data.addPage.id,
          children: [],
          collapsed: true,
          data: {
            title: "",
          },
        });
        setPageTree(newTree);

        await router.push(routes.notion.page.show(result.data.addPage.id));
      }
    })();
  }, [addPage, pageTree, prevPageTree, router, setPageTree]);

  return <>{props.children}</>;
};
