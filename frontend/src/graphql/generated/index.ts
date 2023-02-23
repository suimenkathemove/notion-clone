import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  ChannelId: any;
  ChannelName: any;
  DateTimeUtc: any;
  MessageId: any;
  ThreadId: any;
};

export type Channel = {
  __typename?: 'Channel';
  createdAt: Scalars['DateTimeUtc'];
  description: Scalars['String'];
  id: Scalars['ChannelId'];
  name: Scalars['ChannelName'];
  private: Scalars['Boolean'];
  threads: Array<Thread>;
  updatedAt: Scalars['DateTimeUtc'];
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
  description: Scalars['String'];
  name: Scalars['ChannelName'];
  private: Scalars['Boolean'];
};

export type QueryRoot = {
  __typename?: 'QueryRoot';
  healthCheck: Scalars['String'];
  listChannel: Array<Channel>;
  listThreadByChannelId: Array<Thread>;
};


export type QueryRootListThreadByChannelIdArgs = {
  channelId: Scalars['ChannelId'];
};

export type Thread = {
  __typename?: 'Thread';
  id: Scalars['ThreadId'];
  messages: Array<Message>;
};

export type ListChannelQueryVariables = Exact<{ [key: string]: never; }>;


export type ListChannelQuery = { __typename?: 'QueryRoot', listChannel: Array<{ __typename?: 'Channel', id: any, name: any }> };

export type HealthCheckQueryVariables = Exact<{ [key: string]: never; }>;


export type HealthCheckQuery = { __typename?: 'QueryRoot', healthCheck: string };


export const ListChannelDocument = gql`
    query listChannel {
  listChannel {
    id
    name
  }
}
    `;

/**
 * __useListChannelQuery__
 *
 * To run a query within a React component, call `useListChannelQuery` and pass it any options that fit your needs.
 * When your component renders, `useListChannelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListChannelQuery({
 *   variables: {
 *   },
 * });
 */
export function useListChannelQuery(baseOptions?: Apollo.QueryHookOptions<ListChannelQuery, ListChannelQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListChannelQuery, ListChannelQueryVariables>(ListChannelDocument, options);
      }
export function useListChannelLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListChannelQuery, ListChannelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListChannelQuery, ListChannelQueryVariables>(ListChannelDocument, options);
        }
export type ListChannelQueryHookResult = ReturnType<typeof useListChannelQuery>;
export type ListChannelLazyQueryHookResult = ReturnType<typeof useListChannelLazyQuery>;
export type ListChannelQueryResult = Apollo.QueryResult<ListChannelQuery, ListChannelQueryVariables>;
export const HealthCheckDocument = gql`
    query healthCheck {
  healthCheck
}
    `;

/**
 * __useHealthCheckQuery__
 *
 * To run a query within a React component, call `useHealthCheckQuery` and pass it any options that fit your needs.
 * When your component renders, `useHealthCheckQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHealthCheckQuery({
 *   variables: {
 *   },
 * });
 */
export function useHealthCheckQuery(baseOptions?: Apollo.QueryHookOptions<HealthCheckQuery, HealthCheckQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HealthCheckQuery, HealthCheckQueryVariables>(HealthCheckDocument, options);
      }
export function useHealthCheckLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HealthCheckQuery, HealthCheckQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HealthCheckQuery, HealthCheckQueryVariables>(HealthCheckDocument, options);
        }
export type HealthCheckQueryHookResult = ReturnType<typeof useHealthCheckQuery>;
export type HealthCheckLazyQueryHookResult = ReturnType<typeof useHealthCheckLazyQuery>;
export type HealthCheckQueryResult = Apollo.QueryResult<HealthCheckQuery, HealthCheckQueryVariables>;