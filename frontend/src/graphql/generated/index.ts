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
  PageId: any;
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

export type DeleteChannelOutput = {
  __typename?: 'DeleteChannelOutput';
  id: Scalars['ChannelId'];
};

export type DeleteMessageOutput = {
  __typename?: 'DeleteMessageOutput';
  id: Scalars['MessageId'];
};

export type DeleteThreadOutput = {
  __typename?: 'DeleteThreadOutput';
  id: Scalars['ThreadId'];
};

export type Message = {
  __typename?: 'Message';
  createdAt: Scalars['DateTimeUtc'];
  id: Scalars['MessageId'];
  text: Scalars['String'];
  updatedAt: Scalars['DateTimeUtc'];
};

export type MutationRoot = {
  __typename?: 'MutationRoot';
  addMessage: Message;
  createChannel: Channel;
  createPage: Page;
  deleteChannel: DeleteChannelOutput;
  deleteMessage: DeleteMessageOutput;
  reply: Message;
};


export type MutationRootAddMessageArgs = {
  channelId: Scalars['ChannelId'];
  text: Scalars['String'];
};


export type MutationRootCreateChannelArgs = {
  description: Scalars['String'];
  name: Scalars['ChannelName'];
  private: Scalars['Boolean'];
};


export type MutationRootCreatePageArgs = {
  text: Scalars['String'];
  title: Scalars['String'];
};


export type MutationRootDeleteChannelArgs = {
  id: Scalars['ChannelId'];
};


export type MutationRootDeleteMessageArgs = {
  id: Scalars['MessageId'];
};


export type MutationRootReplyArgs = {
  text: Scalars['String'];
  threadId: Scalars['ThreadId'];
};

export type Page = {
  __typename?: 'Page';
  createdAt: Scalars['DateTimeUtc'];
  id: Scalars['PageId'];
  text: Scalars['String'];
  title: Scalars['String'];
  updatedAt: Scalars['DateTimeUtc'];
};

export type QueryRoot = {
  __typename?: 'QueryRoot';
  deleteThread: DeleteThreadOutput;
  getChannel: Channel;
  getThread: Thread;
  healthCheck: Scalars['String'];
  helloWorld: Scalars['String'];
  listChannel: Array<Channel>;
  listPage: Array<Page>;
  listThreadByChannelId: Array<Thread>;
};


export type QueryRootDeleteThreadArgs = {
  id: Scalars['ThreadId'];
};


export type QueryRootGetChannelArgs = {
  id: Scalars['ChannelId'];
};


export type QueryRootGetThreadArgs = {
  id: Scalars['ThreadId'];
};


export type QueryRootListThreadByChannelIdArgs = {
  channelId: Scalars['ChannelId'];
};

export type Thread = {
  __typename?: 'Thread';
  createdAt: Scalars['DateTimeUtc'];
  id: Scalars['ThreadId'];
  messages: Array<Message>;
  updatedAt: Scalars['DateTimeUtc'];
};

export type ListPageQueryVariables = Exact<{ [key: string]: never; }>;


export type ListPageQuery = { __typename?: 'QueryRoot', listPage: Array<{ __typename?: 'Page', id: any, title: string, text: string }> };

export type CreatePageMutationVariables = Exact<{
  title: Scalars['String'];
  text: Scalars['String'];
}>;


export type CreatePageMutation = { __typename?: 'MutationRoot', createPage: { __typename?: 'Page', id: any, title: string } };

export type ListChannelQueryVariables = Exact<{ [key: string]: never; }>;


export type ListChannelQuery = { __typename?: 'QueryRoot', listChannel: Array<{ __typename?: 'Channel', id: any, name: any }> };

export type GetChannelQueryVariables = Exact<{
  id: Scalars['ChannelId'];
}>;


export type GetChannelQuery = { __typename?: 'QueryRoot', getChannel: { __typename?: 'Channel', id: any, name: any, threads: Array<{ __typename?: 'Thread', id: any, messages: Array<{ __typename?: 'Message', id: any, text: string }> }> } };

export type AddMessageMutationVariables = Exact<{
  channelId: Scalars['ChannelId'];
  text: Scalars['String'];
}>;


export type AddMessageMutation = { __typename?: 'MutationRoot', addMessage: { __typename?: 'Message', id: any, text: string } };

export type GetThreadQueryVariables = Exact<{
  id: Scalars['ThreadId'];
}>;


export type GetThreadQuery = { __typename?: 'QueryRoot', getThread: { __typename?: 'Thread', id: any, messages: Array<{ __typename?: 'Message', id: any, text: string }> } };

export type ReplyMutationVariables = Exact<{
  threadId: Scalars['ThreadId'];
  text: Scalars['String'];
}>;


export type ReplyMutation = { __typename?: 'MutationRoot', reply: { __typename?: 'Message', id: any, text: string } };

export type HealthCheckQueryVariables = Exact<{ [key: string]: never; }>;


export type HealthCheckQuery = { __typename?: 'QueryRoot', healthCheck: string };


export const ListPageDocument = gql`
    query listPage {
  listPage {
    id
    title
    text
  }
}
    `;

/**
 * __useListPageQuery__
 *
 * To run a query within a React component, call `useListPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useListPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListPageQuery({
 *   variables: {
 *   },
 * });
 */
export function useListPageQuery(baseOptions?: Apollo.QueryHookOptions<ListPageQuery, ListPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListPageQuery, ListPageQueryVariables>(ListPageDocument, options);
      }
export function useListPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListPageQuery, ListPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListPageQuery, ListPageQueryVariables>(ListPageDocument, options);
        }
export type ListPageQueryHookResult = ReturnType<typeof useListPageQuery>;
export type ListPageLazyQueryHookResult = ReturnType<typeof useListPageLazyQuery>;
export type ListPageQueryResult = Apollo.QueryResult<ListPageQuery, ListPageQueryVariables>;
export const CreatePageDocument = gql`
    mutation createPage($title: String!, $text: String!) {
  createPage(title: $title, text: $text) {
    id
    title
  }
}
    `;
export type CreatePageMutationFn = Apollo.MutationFunction<CreatePageMutation, CreatePageMutationVariables>;

/**
 * __useCreatePageMutation__
 *
 * To run a mutation, you first call `useCreatePageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPageMutation, { data, loading, error }] = useCreatePageMutation({
 *   variables: {
 *      title: // value for 'title'
 *      text: // value for 'text'
 *   },
 * });
 */
export function useCreatePageMutation(baseOptions?: Apollo.MutationHookOptions<CreatePageMutation, CreatePageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePageMutation, CreatePageMutationVariables>(CreatePageDocument, options);
      }
export type CreatePageMutationHookResult = ReturnType<typeof useCreatePageMutation>;
export type CreatePageMutationResult = Apollo.MutationResult<CreatePageMutation>;
export type CreatePageMutationOptions = Apollo.BaseMutationOptions<CreatePageMutation, CreatePageMutationVariables>;
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
    mutation addMessage($channelId: ChannelId!, $text: String!) {
  addMessage(channelId: $channelId, text: $text) {
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
 *      text: // value for 'text'
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
export const GetThreadDocument = gql`
    query getThread($id: ThreadId!) {
  getThread(id: $id) {
    id
    messages {
      id
      text
    }
  }
}
    `;

/**
 * __useGetThreadQuery__
 *
 * To run a query within a React component, call `useGetThreadQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetThreadQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetThreadQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetThreadQuery(baseOptions: Apollo.QueryHookOptions<GetThreadQuery, GetThreadQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetThreadQuery, GetThreadQueryVariables>(GetThreadDocument, options);
      }
export function useGetThreadLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetThreadQuery, GetThreadQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetThreadQuery, GetThreadQueryVariables>(GetThreadDocument, options);
        }
export type GetThreadQueryHookResult = ReturnType<typeof useGetThreadQuery>;
export type GetThreadLazyQueryHookResult = ReturnType<typeof useGetThreadLazyQuery>;
export type GetThreadQueryResult = Apollo.QueryResult<GetThreadQuery, GetThreadQueryVariables>;
export const ReplyDocument = gql`
    mutation reply($threadId: ThreadId!, $text: String!) {
  reply(threadId: $threadId, text: $text) {
    id
    text
  }
}
    `;
export type ReplyMutationFn = Apollo.MutationFunction<ReplyMutation, ReplyMutationVariables>;

/**
 * __useReplyMutation__
 *
 * To run a mutation, you first call `useReplyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReplyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [replyMutation, { data, loading, error }] = useReplyMutation({
 *   variables: {
 *      threadId: // value for 'threadId'
 *      text: // value for 'text'
 *   },
 * });
 */
export function useReplyMutation(baseOptions?: Apollo.MutationHookOptions<ReplyMutation, ReplyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReplyMutation, ReplyMutationVariables>(ReplyDocument, options);
      }
export type ReplyMutationHookResult = ReturnType<typeof useReplyMutation>;
export type ReplyMutationResult = Apollo.MutationResult<ReplyMutation>;
export type ReplyMutationOptions = Apollo.BaseMutationOptions<ReplyMutation, ReplyMutationVariables>;
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