import { NextPage } from "next";
import { useRouter } from "next/router";

import { ChannelPagePresenter } from "./presenter";

import { useGetChannelQuery, useListChannelQuery } from "@/graphql/generated";

export const ChannelPage: NextPage = () => {
  const router = useRouter();

  const listChannelResult = useListChannelQuery();

  const getChannelResult = useGetChannelQuery({
    variables: { id: router.query["channel-id"] },
  });

  return (
    <ChannelPagePresenter
      channels={listChannelResult.data?.listChannel}
      chatRoomProps={{
        threads: getChannelResult.data?.getChannel.threads.map((t) => ({
          id: t.id,
          firstMessage: { sendAccountAvatar: "", text: t.messages[0]!.text },
          reply: null,
        })),
      }}
    />
  );
};
