import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

import { ChannelPagePresenter } from "./presenter";

import {
  useAddMessageMutation,
  useGetChannelQuery,
  useGetThreadLazyQuery,
  useListChannelQuery,
  useReplyMutation,
} from "@/graphql/generated";

export const ChannelPage: NextPage = () => {
  const router = useRouter();
  const channelId = router.query["channel-id"];

  const listChannelResult = useListChannelQuery();

  const getChannelResult = useGetChannelQuery({ variables: { id: channelId } });

  const [addMessageMutation] = useAddMessageMutation();
  const addMessage = useCallback(
    async (text: string) => {
      await addMessageMutation({ variables: { channelId, messageText: text } });
    },
    [addMessageMutation, channelId],
  );

  const [threadShow, setThreadShow] =
    useState<{ id: string; messages: { id: string; text: string }[] } | null>(
      null,
    );
  const [getThreadQuery] = useGetThreadLazyQuery();
  const onOpenThread = useCallback(
    async (threadId: string) => {
      const getThreadResult = await getThreadQuery({ variables: { threadId } });
      if (getThreadResult.data != null) {
        setThreadShow(getThreadResult.data.getThread);
      }
    },
    [getThreadQuery],
  );
  const onCloseThread = useCallback(() => {
    setThreadShow(null);
  }, []);

  const [replyMutation] = useReplyMutation();
  const reply = useCallback(
    async (threadId: string, messageText: string) => {
      await replyMutation({ variables: { threadId, messageText } });

      const getThreadResult = await getThreadQuery({ variables: { threadId } });
      if (getThreadResult.data != null) {
        setThreadShow(getThreadResult.data.getThread);
      }
    },
    [getThreadQuery, replyMutation],
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
        threadShow,
        onOpenThread,
        onCloseThread,
        reply,
      }}
    />
  );
};
