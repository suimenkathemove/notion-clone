import { useCallback, useState } from "react";

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

  return (
    <div>
      <ul>
        {props.threads != null &&
          props.threads.map((t) => <li key={t.id}>{t.firstMessage.text}</li>)}
      </ul>
      <input
        value={value}
        onChange={onChange}
        style={{ border: "1px solid black" }}
      />
      <button onClick={onSubmit}>{">"}</button>
    </div>
  );
};
