import { NextPage } from "next";

import { ChannelPagePresenter } from "./presenter";

import { useListChannelQuery } from "@/graphql/generated";

export const ChannelPage: NextPage = () => {
  const listChannelResult = useListChannelQuery();

  return (
    <ChannelPagePresenter channels={listChannelResult.data?.listChannel} />
  );
};
