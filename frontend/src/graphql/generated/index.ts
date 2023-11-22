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

export type AddPageResult = GraphQlError | Page;

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

export type GetPageResult = GraphQlError | Page;

export type GraphQlError = {
  __typename?: 'GraphQLError';
  code: GraphQlErrorCode;
};

export enum GraphQlErrorCode {
  InternalServerError = 'INTERNAL_SERVER_ERROR',
  NotFound = 'NOT_FOUND'
}

export type ListAncestorPagesResult = GraphQlError | ListPages;

export type ListChildrenPagesResult = GraphQlError | ListPages;

export type ListDescendantPagesResult = GraphQlError | ListPages;

export type ListPages = {
  __typename?: 'ListPages';
  items: Array<Page>;
};

export type ListPagesResult = GraphQlError | ListPages;

export type ListRootPagesResult = GraphQlError | ListPages;

export type Message = {
  __typename?: 'Message';
  createdAt: Scalars['DateTimeUtc'];
  id: Scalars['MessageId'];
  text: Scalars['String'];
  updatedAt: Scalars['DateTimeUtc'];
};

export type MovePage = {
  __typename?: 'MovePage';
  id: Scalars['PageId'];
};

export type MovePageResult = GraphQlError | MovePage;

export type MutationRoot = {
  __typename?: 'MutationRoot';
  addMessage: Message;
  addPage: AddPageResult;
  createChannel: Channel;
  deleteChannel: DeleteChannelOutput;
  deleteMessage: DeleteMessageOutput;
  movePage: MovePageResult;
  removePage: RemovePageResult;
  reply: Message;
};


export type MutationRootAddMessageArgs = {
  channelId: Scalars['ChannelId'];
  text: Scalars['String'];
};


export type MutationRootAddPageArgs = {
  parentId?: InputMaybe<Scalars['PageId']>;
  text: Scalars['String'];
  title: Scalars['String'];
};


export type MutationRootCreateChannelArgs = {
  description: Scalars['String'];
  name: Scalars['ChannelName'];
  private: Scalars['Boolean'];
};


export type MutationRootDeleteChannelArgs = {
  id: Scalars['ChannelId'];
};


export type MutationRootDeleteMessageArgs = {
  id: Scalars['MessageId'];
};


export type MutationRootMovePageArgs = {
  id: Scalars['PageId'];
  toParentId: Scalars['PageId'];
};


export type MutationRootRemovePageArgs = {
  id: Scalars['PageId'];
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
  getPage: GetPageResult;
  getThread: Thread;
  healthCheck: Scalars['String'];
  helloWorld: Scalars['String'];
  listAncestorPages: ListAncestorPagesResult;
  listChannel: Array<Channel>;
  listChildrenPages: ListChildrenPagesResult;
  listDescendantPages: ListDescendantPagesResult;
  listPages: ListPagesResult;
  listRootPages: ListRootPagesResult;
  listThreadByChannelId: Array<Thread>;
};


export type QueryRootDeleteThreadArgs = {
  id: Scalars['ThreadId'];
};


export type QueryRootGetChannelArgs = {
  id: Scalars['ChannelId'];
};


export type QueryRootGetPageArgs = {
  id: Scalars['PageId'];
};


export type QueryRootGetThreadArgs = {
  id: Scalars['ThreadId'];
};


export type QueryRootListAncestorPagesArgs = {
  id: Scalars['PageId'];
};


export type QueryRootListChildrenPagesArgs = {
  id: Scalars['PageId'];
};


export type QueryRootListDescendantPagesArgs = {
  id: Scalars['PageId'];
};


export type QueryRootListThreadByChannelIdArgs = {
  channelId: Scalars['ChannelId'];
};

export type RemovePage = {
  __typename?: 'RemovePage';
  id: Scalars['PageId'];
};

export type RemovePageResult = GraphQlError | RemovePage;

export type Thread = {
  __typename?: 'Thread';
  createdAt: Scalars['DateTimeUtc'];
  id: Scalars['ThreadId'];
  messages: Array<Message>;
  updatedAt: Scalars['DateTimeUtc'];
};

export type ListRootPagesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListRootPagesQuery = { __typename?: 'QueryRoot', listRootPages: { __typename: 'GraphQLError' } | { __typename: 'ListPages', items: Array<{ __typename?: 'Page', id: any, title: string, text: string }> } };

export type AddPageMutationVariables = Exact<{
  title: Scalars['String'];
  text: Scalars['String'];
}>;


export type AddPageMutation = { __typename?: 'MutationRoot', addPage: { __typename?: 'GraphQLError' } | { __typename?: 'Page', id: any, title: string } };

export type RemovePageMutationVariables = Exact<{
  id: Scalars['PageId'];
}>;


export type RemovePageMutation = { __typename?: 'MutationRoot', removePage: { __typename?: 'GraphQLError' } | { __typename?: 'RemovePage', id: any } };

export type GetPageInPagePageQueryVariables = Exact<{
  id: Scalars['PageId'];
}>;


export type GetPageInPagePageQuery = { __typename?: 'QueryRoot', getPage: { __typename: 'GraphQLError' } | { __typename: 'Page', id: any, title: string, text: string } };

export type ListAncestorPagesQueryVariables = Exact<{
  id: Scalars['PageId'];
}>;


export type ListAncestorPagesQuery = { __typename?: 'QueryRoot', listAncestorPages: { __typename: 'GraphQLError' } | { __typename: 'ListPages', items: Array<{ __typename?: 'Page', id: any, title: string }> } };

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


export const ListRootPagesDocument = gql`
    query ListRootPages {
  listRootPages {
    __typename
    ... on ListPages {
      items {
        id
        title
        text
      }
    }
  }
}
    `;

/**
 * __useListRootPagesQuery__
 *
 * To run a query within a React component, call `useListRootPagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListRootPagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListRootPagesQuery({
 *   variables: {
 *   },
 * });
 */
export function useListRootPagesQuery(baseOptions?: Apollo.QueryHookOptions<ListRootPagesQuery, ListRootPagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListRootPagesQuery, ListRootPagesQueryVariables>(ListRootPagesDocument, options);
      }
export function useListRootPagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListRootPagesQuery, ListRootPagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListRootPagesQuery, ListRootPagesQueryVariables>(ListRootPagesDocument, options);
        }
export type ListRootPagesQueryHookResult = ReturnType<typeof useListRootPagesQuery>;
export type ListRootPagesLazyQueryHookResult = ReturnType<typeof useListRootPagesLazyQuery>;
export type ListRootPagesQueryResult = Apollo.QueryResult<ListRootPagesQuery, ListRootPagesQueryVariables>;
export const AddPageDocument = gql`
    mutation AddPage($title: String!, $text: String!) {
  addPage(title: $title, text: $text) {
    ... on Page {
      id
      title
    }
  }
}
    `;
export type AddPageMutationFn = Apollo.MutationFunction<AddPageMutation, AddPageMutationVariables>;

/**
 * __useAddPageMutation__
 *
 * To run a mutation, you first call `useAddPageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddPageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addPageMutation, { data, loading, error }] = useAddPageMutation({
 *   variables: {
 *      title: // value for 'title'
 *      text: // value for 'text'
 *   },
 * });
 */
export function useAddPageMutation(baseOptions?: Apollo.MutationHookOptions<AddPageMutation, AddPageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddPageMutation, AddPageMutationVariables>(AddPageDocument, options);
      }
export type AddPageMutationHookResult = ReturnType<typeof useAddPageMutation>;
export type AddPageMutationResult = Apollo.MutationResult<AddPageMutation>;
export type AddPageMutationOptions = Apollo.BaseMutationOptions<AddPageMutation, AddPageMutationVariables>;
export const RemovePageDocument = gql`
    mutation RemovePage($id: PageId!) {
  removePage(id: $id) {
    ... on RemovePage {
      id
    }
  }
}
    `;
export type RemovePageMutationFn = Apollo.MutationFunction<RemovePageMutation, RemovePageMutationVariables>;

/**
 * __useRemovePageMutation__
 *
 * To run a mutation, you first call `useRemovePageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemovePageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removePageMutation, { data, loading, error }] = useRemovePageMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemovePageMutation(baseOptions?: Apollo.MutationHookOptions<RemovePageMutation, RemovePageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemovePageMutation, RemovePageMutationVariables>(RemovePageDocument, options);
      }
export type RemovePageMutationHookResult = ReturnType<typeof useRemovePageMutation>;
export type RemovePageMutationResult = Apollo.MutationResult<RemovePageMutation>;
export type RemovePageMutationOptions = Apollo.BaseMutationOptions<RemovePageMutation, RemovePageMutationVariables>;
export const GetPageInPagePageDocument = gql`
    query GetPageInPagePage($id: PageId!) {
  getPage(id: $id) {
    __typename
    ... on Page {
      id
      title
      text
    }
  }
}
    `;

/**
 * __useGetPageInPagePageQuery__
 *
 * To run a query within a React component, call `useGetPageInPagePageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPageInPagePageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPageInPagePageQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPageInPagePageQuery(baseOptions: Apollo.QueryHookOptions<GetPageInPagePageQuery, GetPageInPagePageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPageInPagePageQuery, GetPageInPagePageQueryVariables>(GetPageInPagePageDocument, options);
      }
export function useGetPageInPagePageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPageInPagePageQuery, GetPageInPagePageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPageInPagePageQuery, GetPageInPagePageQueryVariables>(GetPageInPagePageDocument, options);
        }
export type GetPageInPagePageQueryHookResult = ReturnType<typeof useGetPageInPagePageQuery>;
export type GetPageInPagePageLazyQueryHookResult = ReturnType<typeof useGetPageInPagePageLazyQuery>;
export type GetPageInPagePageQueryResult = Apollo.QueryResult<GetPageInPagePageQuery, GetPageInPagePageQueryVariables>;
export const ListAncestorPagesDocument = gql`
    query ListAncestorPages($id: PageId!) {
  listAncestorPages(id: $id) {
    __typename
    ... on ListPages {
      items {
        id
        title
      }
    }
  }
}
    `;

/**
 * __useListAncestorPagesQuery__
 *
 * To run a query within a React component, call `useListAncestorPagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListAncestorPagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListAncestorPagesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useListAncestorPagesQuery(baseOptions: Apollo.QueryHookOptions<ListAncestorPagesQuery, ListAncestorPagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListAncestorPagesQuery, ListAncestorPagesQueryVariables>(ListAncestorPagesDocument, options);
      }
export function useListAncestorPagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListAncestorPagesQuery, ListAncestorPagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListAncestorPagesQuery, ListAncestorPagesQueryVariables>(ListAncestorPagesDocument, options);
        }
export type ListAncestorPagesQueryHookResult = ReturnType<typeof useListAncestorPagesQuery>;
export type ListAncestorPagesLazyQueryHookResult = ReturnType<typeof useListAncestorPagesLazyQuery>;
export type ListAncestorPagesQueryResult = Apollo.QueryResult<ListAncestorPagesQuery, ListAncestorPagesQueryVariables>;
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