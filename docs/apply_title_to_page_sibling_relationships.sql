SELECT
  ancestor_pages.title,
  descendant_pages.title,
  weight
FROM
  notion.page_sibling_relationships
  JOIN notion.pages ancestor_pages ON notion.page_sibling_relationships.ancestor = ancestor_pages.id
  JOIN notion.pages descendant_pages ON notion.page_sibling_relationships.descendant = descendant_pages.id
ORDER BY
  ancestor_pages.title,
  descendant_pages.title
