import { ChannelList } from "@/components/channel-list";
import { Channel } from "@/graphql/generated";

export type ChannelPagePresenterProps = {
  channels: Pick<Channel, "id" | "name">[] | undefined;
};

export const ChannelPagePresenter: React.FC<ChannelPagePresenterProps> = (
  props,
) => {
  return (
    <div>
      {props.channels != null && <ChannelList channels={props.channels} />}
    </div>
  );
};
