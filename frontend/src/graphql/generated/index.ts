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
  getChannel: Channel;
  healthCheck: Scalars['String'];
  listChannel: Array<Channel>;
  listThreadByChannelId: Array<Thread>;
};


export type QueryRootGetChannelArgs = {
  id: Scalars['ChannelId'];
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

export type GetChannelQueryVariables = Exact<{
  id: Scalars['ChannelId'];
}>;


export type GetChannelQuery = { __typename?: 'QueryRoot', getChannel: { __typename?: 'Channel', id: any, name: any, threads: Array<{ __typename?: 'Thread', id: any, messages: Array<{ __typename?: 'Message', id: any, text: string }> }> } };

export type AddMessageMutationVariables = Exact<{
  channelId: Scalars['ChannelId'];
  messageText: Scalars['String'];
}>;


export type AddMessageMutation = { __typename?: 'MutationRoot', addMessage: { __typename?: 'Message', id: any, text: string } };

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
export const GetChannelDocument = gql`
    query getChannel($id: ChannelId!) {
  getChannel(id: $id) {
    id
    name
    threads {
      id
      messages {
        id
        text
      }
    }
  }
}
    `;

/**
 * __useGetChannelQuery__
 *
 * To run a query within a React component, call `useGetChannelQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChannelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChannelQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetChannelQuery(baseOptions: Apollo.QueryHookOptions<GetChannelQuery, GetChannelQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChannelQuery, GetChannelQueryVariables>(GetChannelDocument, options);
      }
export function useGetChannelLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChannelQuery, GetChannelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChannelQuery, GetChannelQueryVariables>(GetChannelDocument, options);
        }
export type GetChannelQueryHookResult = ReturnType<typeof useGetChannelQuery>;
export type GetChannelLazyQueryHookResult = ReturnType<typeof useGetChannelLazyQuery>;
export type GetChannelQueryResult = Apollo.QueryResult<GetChannelQuery, GetChannelQueryVariables>;
export const AddMessageDocument = gql`
    mutation addMessage($channelId: ChannelId!, $messageText: String!) {
  addMessage(channelId: $channelId, messageText: $messageText) {
    id
    text
  }
}
    `;
export type AddMessageMutationFn = Apollo.MutationFunction<AddMessageMutation, AddMessageMutationVariables>;

/**
 * __useAddMessageMutation__
 *
 * To run a mutation, you first call `useAddMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addMessageMutation, { data, loading, error }] = useAddMessageMutation({
 *   variables: {
 *      channelId: // value for 'channelId'
 *      messageText: // value for 'messageText'
 *   },
 * });
 */
export function useAddMessageMutation(baseOptions?: Apollo.MutationHookOptions<AddMessageMutation, AddMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddMessageMutation, AddMessageMutationVariables>(AddMessageDocument, options);
      }
export type AddMessageMutationHookResult = ReturnType<typeof useAddMessageMutation>;
export type AddMessageMutationResult = Apollo.MutationResult<AddMessageMutation>;
export type AddMessageMutationOptions = Apollo.BaseMutationOptions<AddMessageMutation, AddMessageMutationVariables>;
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