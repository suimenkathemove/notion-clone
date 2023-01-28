/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  ChannelId: any;
  ChannelName: any;
  MessageId: any;
  ThreadId: any;
};

export type Channel = {
  __typename?: 'Channel';
  id: Scalars['ChannelId'];
  name: Scalars['ChannelName'];
  threads: Array<Thread>;
};

export type Message = {
  __typename?: 'Message';
  id: Scalars['MessageId'];
  text: Scalars['String'];
};

export type MutationRoot = {
  __typename?: 'MutationRoot';
  addMessage: Message;
  addMessageToThread: Message;
  createChannel: Channel;
};


export type MutationRootAddMessageArgs = {
  channelId: Scalars['ChannelId'];
  messageText: Scalars['String'];
};


export type MutationRootAddMessageToThreadArgs = {
  messageText: Scalars['String'];
  threadId: Scalars['ThreadId'];
};


export type MutationRootCreateChannelArgs = {
  channelName: Scalars['ChannelName'];
};

export type QueryRoot = {
  __typename?: 'QueryRoot';
  getChannelList: Array<Channel>;
  getThreadListByChannelId: Array<Thread>;
  healthCheck: Scalars['String'];
};


export type QueryRootGetThreadListByChannelIdArgs = {
  channelId: Scalars['ChannelId'];
};

export type Thread = {
  __typename?: 'Thread';
  id: Scalars['ThreadId'];
  messages: Array<Message>;
};
