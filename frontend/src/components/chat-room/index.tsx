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
};

export const ChatRoom: React.FC<ChatRoomProps> = (props) => {
  return (
    <ul>
      {props.threads != null &&
        props.threads.map((t) => <li key={t.id}>{t.firstMessage.text}</li>)}
    </ul>
  );
};
