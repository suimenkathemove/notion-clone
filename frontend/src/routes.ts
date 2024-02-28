const client = "/client";

const notion = "/notion";

export const routes = {
  channel: {
    show: (workspaceId: string, channelId: string) =>
      `${client}/${workspaceId}/${channelId}`,
  },
  notion: {
    page: {
      show: (pageId: string) => `${notion}/${pageId}`,
    },
  },
};
