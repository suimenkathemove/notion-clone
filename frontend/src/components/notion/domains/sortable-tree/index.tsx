import {
  ContentProps,
  Popover,
  TriggerProps,
} from "@suimenkathemove/react-library";
import Link from "next/link";
import { forwardRef } from "react";
import {
  ChevronDown,
  ChevronRight,
  Edit,
  Menu,
  Plus,
  Trash2,
} from "react-feather";
import {
  ContainerProps,
  FlattenedTreeItem,
  ItemProps,
  MoveTarget,
  NodeId,
  ReactNotionSortableTree,
  Tree,
} from "react-notion-sortable-tree";

import { routes } from "@/routes";

const characterStyle: React.CSSProperties = {
  fontFamily: "BlinkMacSystemFont, sans-serif",
  fontSize: 14,
  fontWeight: 500,
  color: "rgba(25, 23, 17, 0.6)",
};

const ICON_SIZE = 16;

type Data = {
  title: string;
};

export interface SortableTreeProps {
  tree: Tree<Data>;
  onClickCollapse: (item: FlattenedTreeItem<Data>) => void;
  onClickAddRoot: () => void;
  onClickAddChild: (id: NodeId) => void;
  onClickRename: (item: FlattenedTreeItem<Data>) => void;
  onClickDelete: (id: NodeId) => void;
  onMove: (fromItem: FlattenedTreeItem<Data>, target: MoveTarget) => void;
}

export const SortableTree: React.FC<SortableTreeProps> = (props) => {
  return (
    <div
      style={{
        width: 240,
        backgroundColor: "rgb(251 251 250)",
      }}
    >
      <ReactNotionSortableTree
        tree={props.tree}
        Container={forwardRef<HTMLDivElement, ContainerProps>(
          (containerProps, ref) => (
            <div style={containerProps.style} ref={ref}>
              {containerProps.children}
            </div>
          ),
        )}
        Item={forwardRef<HTMLDivElement, ItemProps<HTMLDivElement, Data>>(
          (itemProps, ref) => (
            <Link
              href={routes.notion.page.show(itemProps.item.id)}
              onDragStart={(event) => {
                event.preventDefault();
              }}
            >
              <div
                onPointerDown={itemProps.onPointerDown}
                style={{
                  ...itemProps.style,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  paddingTop: 2,
                  paddingBottom: 2,
                  paddingLeft: 8 + itemProps.paddingLeft,
                  paddingRight: 8,
                  ...characterStyle,
                }}
                ref={ref}
              >
                <button
                  onClick={(event) => {
                    event.preventDefault();

                    props.onClickCollapse(itemProps.item);
                  }}
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                  style={{
                    flexGrow: 0,
                    flexShrink: 0,
                  }}
                >
                  {itemProps.item.collapsed ? (
                    <ChevronRight size={ICON_SIZE} />
                  ) : (
                    <ChevronDown size={ICON_SIZE} />
                  )}
                </button>
                <div
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {itemProps.item.data.title || "Untitled"}
                </div>
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                <div
                  onClick={(event) => {
                    event.preventDefault();
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    marginLeft: "auto",
                  }}
                >
                  <Popover
                    Trigger={forwardRef<HTMLButtonElement, TriggerProps>(
                      (triggerProps, ref) => (
                        <button
                          onClick={triggerProps.onClick}
                          onPointerDown={(event) => {
                            event.stopPropagation();
                          }}
                          style={{
                            flexGrow: 0,
                            flexShrink: 0,
                          }}
                          ref={ref}
                        >
                          <Menu size={ICON_SIZE} />
                        </button>
                      ),
                    )}
                    Content={forwardRef<HTMLDivElement, ContentProps>(
                      (contentProps, ref) => (
                        <div
                          onPointerDown={(event) => {
                            event.stopPropagation();
                          }}
                          style={{
                            ...contentProps.style,
                            width: 265,
                            padding: "6px 0",
                            backgroundColor: "white",
                            borderRadius: 6,
                            boxShadow:
                              "rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px",
                            ...characterStyle,
                          }}
                          ref={ref}
                        >
                          <div
                            style={{
                              padding: "0 4px",
                            }}
                          >
                            <button
                              onClick={() => {
                                props.onClickDelete(itemProps.item.id);
                              }}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                width: "100%",
                                height: 28,
                                padding: "0 10px",
                              }}
                            >
                              <Trash2 size={ICON_SIZE} />
                              Delete
                            </button>
                          </div>
                          <div
                            style={{
                              padding: "0 4px",
                            }}
                          >
                            <button
                              onClick={() => {
                                props.onClickRename(itemProps.item);
                              }}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                width: "100%",
                                height: 28,
                                padding: "0 10px",
                              }}
                            >
                              <Edit size={ICON_SIZE} />
                              Rename
                            </button>
                          </div>
                        </div>
                      ),
                    )}
                    positionType="right-top"
                  />
                  <button
                    onClick={() => {
                      props.onClickAddChild(itemProps.item.id);
                    }}
                    onPointerDown={(event) => {
                      event.stopPropagation();
                    }}
                    style={{
                      flexGrow: 0,
                      flexShrink: 0,
                    }}
                  >
                    <Plus size={ICON_SIZE} />
                  </button>
                </div>
              </div>
            </Link>
          ),
        )}
        onMove={props.onMove}
        itemHeight={28}
        paddingPerDepth={24}
        backgroundColor="rgba(35, 131, 226, 0.14)"
        borderHeight={4}
        borderColor="rgba(35, 131, 226, 0.43)"
      />
      <button
        onClick={props.onClickAddRoot}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          width: "100%",
          height: 28,
          padding: "2px 8px",
          ...characterStyle,
        }}
      >
        <Plus size={ICON_SIZE} />
        Add a page
      </button>
    </div>
  );
};
