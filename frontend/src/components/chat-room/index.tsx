import { useCallback, useState } from "react";

import { Container } from "./styles";

export type ChatRoomProps = {
  threads:
    | {
        id: string;
        firstMessage: {
          sendAccountAvatar: string;
          text: string;
        };
        reply: {
          accountAvatars: string[];
          count: number;
        } | null;
      }[]
    | undefined;
  addMessage: (text: string) => Promise<void>;
  threadShow: { id: string; messages: { id: string; text: string }[] } | null;
  onOpenThread: (id: string) => Promise<void>;
  onCloseThread: () => void;
  reply: (threadId: string, text: string) => Promise<void>;
};

export const ChatRoom: React.FC<ChatRoomProps> = (props) => {
  const [value, setValue] = useState("");
  const onChange = useCallback<
    NonNullable<React.InputHTMLAttributes<HTMLInputElement>["onChange"]>
  >((e) => {
    setValue(e.target.value);
  }, []);

  const onSubmit = useCallback(async () => {
    await props.addMessage(value);

    setValue("");
  }, [props, value]);

  const [replyValue, setReplyValue] = useState("");
  const onChangeReply = useCallback<
    NonNullable<React.InputHTMLAttributes<HTMLInputElement>["onChange"]>
  >((e) => {
    setReplyValue(e.target.value);
  }, []);

  const onReply = useCallback(
    async (threadId: string) => {
      await props.reply(threadId, replyValue);

      setReplyValue("");
    },
    [props, replyValue],
  );

  return (
    <Container>
      <div>
        <ul>
          {props.threads != null &&
            props.threads.map((t) => (
              <li key={t.id}>
                <span>{t.firstMessage.text}</span>
                <button
                  onClick={() => {
                    props.onOpenThread(t.id);
                  }}
                >
                  replies
                </button>
              </li>
            ))}
        </ul>
        <div>
          <input
            value={value}
            onChange={onChange}
            style={{ border: "1px solid black" }}
          />
          <button onClick={onSubmit}>{">"}</button>
        </div>
      </div>
      {props.threadShow != null && (
        <div style={{ position: "relative" }}>
          <ul>
            {props.threadShow.messages.map((m) => (
              <li key={m.id}>{m.text}</li>
            ))}
          </ul>
          <button
            onClick={props.onCloseThread}
            style={{ position: "absolute", top: 0, right: 0 }}
          >
            x
          </button>
          <div>
            <input
              value={replyValue}
              onChange={onChangeReply}
              style={{ border: "1px solid black" }}
            />
            <button
              onClick={() => {
                onReply(props.threadShow!.id);
              }}
            >
              {">"}
            </button>
          </div>
        </div>
      )}
    </Container>
  );
};
