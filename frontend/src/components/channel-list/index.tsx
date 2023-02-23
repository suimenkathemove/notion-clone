import { memo } from "react";

import { Channel } from "@/graphql/generated";

export type ChannelListProps = {
  channels: Pick<Channel, "id" | "name">[];
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
