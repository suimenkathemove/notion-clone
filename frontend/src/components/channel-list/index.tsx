import Link from "next/link";
import { memo } from "react";

import { Channel } from "@/graphql/generated";
import { routes } from "@/routes";

export type ChannelListProps = {
  channels: Pick<Channel, "id" | "name">[];
};

export const ChannelList = memo<ChannelListProps>((props) => {
  return (
    <ul>
      {props.channels.map((c) => (
        <li key={c.id}>
          <Link href={routes.channel.show("TODO", c.id)}>#{c.name}</Link>
        </li>
      ))}
    </ul>
  );
});
