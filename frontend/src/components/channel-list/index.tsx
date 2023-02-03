import { Channel } from "graphql-generated";
import { memo } from "react";

export type ChannelListProps = {
  channels: Omit<Channel, "threads">[];
};

export const ChannelList = memo<ChannelListProps>((props) => {
  return (
    <ul>
      {props.channels.map((c) => (
        <li key={c.id}>
          <span>{c.name}</span>
        </li>
      ))}
    </ul>
  );
});
