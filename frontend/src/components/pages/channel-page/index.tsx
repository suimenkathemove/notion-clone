import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback } from "react";

import { ChannelPagePresenter } from "./presenter";

import {
  useAddMessageMutation,
  useGetChannelQuery,
  useListChannelQuery,
} from "@/graphql/generated";

export const ChannelPage: NextPage = () => {
  const router = useRouter();
  const channelId = router.query["channel-id"];

  const listChannelResult = useListChannelQuery();

  const getChannelResult = useGetChannelQuery({ variables: { id: channelId } });

  const [addMessageMutation] = useAddMessageMutation();
  const addMessage = useCallback(
    async (text: string) => {
      await addMessageMutation({
        variables: { channelId, messageText: text },
        refetchQueries: "active",
      });
    },
    [addMessageMutation, channelId],
  );

  return (
    <ChannelPagePresenter
      channels={listChannelResult.data?.listChannel}
      chatRoomProps={{
        threads: getChannelResult.data?.getChannel.threads.map((t) => ({
          id: t.id,
          firstMessage: { sendAccountAvatar: "", text: t.messages[0]!.text },
          reply: null,
        })),
        addMessage,
      }}
    />
  );
};
