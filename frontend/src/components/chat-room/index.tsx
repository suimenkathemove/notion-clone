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
  reply: (threadId: string, messageText: string) => Promise<void>;
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

  const onReply = useCallback(async () => {
    await props.reply("TODO", replyValue);

    setReplyValue("");
  }, [props, replyValue]);

  return (
    <Container>
      <div>
        <ul>
          {props.threads != null &&
            props.threads.map((t) => <li key={t.id}>{t.firstMessage.text}</li>)}
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
      <div>
        <input
          value={replyValue}
          onChange={onChangeReply}
          style={{ border: "1px solid black" }}
        />
        <button onClick={onReply}>{">"}</button>
      </div>
    </Container>
  );
};
