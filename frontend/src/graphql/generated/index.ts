import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  ChannelId: { input: any; output: any; }
  ChannelName: { input: any; output: any; }
  DateTimeUtc: { input: any; output: any; }
  MessageId: { input: any; output: any; }
  PageId: { input: any; output: any; }
  ThreadId: { input: any; output: any; }
};

export type AddPage = {
  text: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type AddPageResult = GraphQlError | Page;

export type Channel = {
  __typename?: 'Channel';
  createdAt: Scalars['DateTimeUtc']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ChannelId']['output'];
  name: Scalars['ChannelName']['output'];
  private: Scalars['Boolean']['output'];
  threads: Array<Thread>;
  updatedAt: Scalars['DateTimeUtc']['output'];
};

export type DeleteChannelOutput = {
  __typename?: 'DeleteChannelOutput';
  id: Scalars['ChannelId']['output'];
};

export type DeleteMessageOutput = {
  __typename?: 'DeleteMessageOutput';
  id: Scalars['MessageId']['output'];
};

export type DeleteThreadOutput = {
  __typename?: 'DeleteThreadOutput';
  id: Scalars['ThreadId']['output'];
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

export type ListDescendantPagesResult = GraphQlError | PageTree;

export type ListPages = {
  __typename?: 'ListPages';
  items: Array<Page>;
};

export type ListRootPagesResult = GraphQlError | ListPages;

export type Message = {
  __typename?: 'Message';
  createdAt: Scalars['DateTimeUtc']['output'];
  id: Scalars['MessageId']['output'];
  text: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeUtc']['output'];
};

export type MovePage = {
  __typename?: 'MovePage';
  id: Scalars['PageId']['output'];
};

export type MovePageResult = GraphQlError | MovePage;

export type MoveTarget = {
  id: Scalars['PageId']['input'];
  type: MoveTargetType;
};

export enum MoveTargetType {
  Parent = 'PARENT',
  Root = 'ROOT',
  SiblingChild = 'SIBLING_CHILD',
  SiblingParent = 'SIBLING_PARENT'
}

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
  updatePage: UpdatePageResult;
};


export type MutationRootAddMessageArgs = {
  channelId: Scalars['ChannelId']['input'];
  text: Scalars['String']['input'];
};


export type MutationRootAddPageArgs = {
  addPage: AddPage;
  parentId?: InputMaybe<Scalars['PageId']['input']>;
};


export type MutationRootCreateChannelArgs = {
  description: Scalars['String']['input'];
  name: Scalars['ChannelName']['input'];
  private: Scalars['Boolean']['input'];
};


export type MutationRootDeleteChannelArgs = {
  id: Scalars['ChannelId']['input'];
};


export type MutationRootDeleteMessageArgs = {
  id: Scalars['MessageId']['input'];
};


export type MutationRootMovePageArgs = {
  id: Scalars['PageId']['input'];
  target: MoveTarget;
};


export type MutationRootRemovePageArgs = {
  id: Scalars['PageId']['input'];
};


export type MutationRootReplyArgs = {
  text: Scalars['String']['input'];
  threadId: Scalars['ThreadId']['input'];
};


export type MutationRootUpdatePageArgs = {
  id: Scalars['PageId']['input'];
  updatePage: UpdatePage;
};

export type Page = {
  __typename?: 'Page';
  createdAt: Scalars['DateTimeUtc']['output'];
  id: Scalars['PageId']['output'];
  text: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeUtc']['output'];
};

export type PageTree = {
  __typename?: 'PageTree';
  children: Array<PageTree>;
  createdAt: Scalars['DateTimeUtc']['output'];
  id: Scalars['PageId']['output'];
  text: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeUtc']['output'];
};

export type QueryRoot = {
  __typename?: 'QueryRoot';
  deleteThread: DeleteThreadOutput;
  getChannel: Channel;
  getPage: GetPageResult;
  getThread: Thread;
  healthCheck: Scalars['String']['output'];
  listAncestorPages: ListAncestorPagesResult;
  listChannel: Array<Channel>;
  listChildrenPages: ListChildrenPagesResult;
  listDescendantPages: ListDescendantPagesResult;
  listRootPages: ListRootPagesResult;
  listThreadByChannelId: Array<Thread>;
};


export type QueryRootDeleteThreadArgs = {
  id: Scalars['ThreadId']['input'];
};


export type QueryRootGetChannelArgs = {
  id: Scalars['ChannelId']['input'];
};


export type QueryRootGetPageArgs = {
  id: Scalars['PageId']['input'];
};


export type QueryRootGetThreadArgs = {
  id: Scalars['ThreadId']['input'];
};


export type QueryRootListAncestorPagesArgs = {
  id: Scalars['PageId']['input'];
};


export type QueryRootListChildrenPagesArgs = {
  id: Scalars['PageId']['input'];
};


export type QueryRootListDescendantPagesArgs = {
  id: Scalars['PageId']['input'];
};


export type QueryRootListThreadByChannelIdArgs = {
  channelId: Scalars['ChannelId']['input'];
};

export type RemovePage = {
  __typename?: 'RemovePage';
  id: Scalars['PageId']['output'];
};

export type RemovePageResult = GraphQlError | RemovePage;

export type Thread = {
  __typename?: 'Thread';
  createdAt: Scalars['DateTimeUtc']['output'];
  id: Scalars['ThreadId']['output'];
  messages: Array<Message>;
  updatedAt: Scalars['DateTimeUtc']['output'];
};

export type UpdatePage = {
  text?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePageResult = GraphQlError | Page;

export type HealthCheckQueryVariables = Exact<{ [key: string]: never; }>;


export type HealthCheckQuery = { __typename?: 'QueryRoot', healthCheck: string };

export type ListRootPagesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListRootPagesQuery = { __typename?: 'QueryRoot', listRootPages: { __typename: 'GraphQLError' } | { __typename: 'ListPages', items: Array<{ __typename?: 'Page', id: any, title: string }> } };

export type ListChildrenPagesQueryVariables = Exact<{
  id: Scalars['PageId']['input'];
}>;


export type ListChildrenPagesQuery = { __typename?: 'QueryRoot', listChildrenPages: { __typename: 'GraphQLError' } | { __typename: 'ListPages', items: Array<{ __typename?: 'Page', id: any, title: string }> } };

export type AddPageMutationVariables = Exact<{
  parentId?: InputMaybe<Scalars['PageId']['input']>;
  addPage: AddPage;
}>;


export type AddPageMutation = { __typename?: 'MutationRoot', addPage: { __typename?: 'GraphQLError' } | { __typename?: 'Page', id: any, title: string } };

export type UpdatePageMutationVariables = Exact<{
  id: Scalars['PageId']['input'];
  updatePage: UpdatePage;
}>;


export type UpdatePageMutation = { __typename?: 'MutationRoot', updatePage: { __typename?: 'GraphQLError' } | { __typename?: 'Page', id: any, title: string, text: string } };

export type RemovePageMutationVariables = Exact<{
  id: Scalars['PageId']['input'];
}>;


export type RemovePageMutation = { __typename?: 'MutationRoot', removePage: { __typename?: 'GraphQLError' } | { __typename?: 'RemovePage', id: any } };

export type MovePageMutationVariables = Exact<{
  id: Scalars['PageId']['input'];
  target: MoveTarget;
}>;


export type MovePageMutation = { __typename?: 'MutationRoot', movePage: { __typename?: 'GraphQLError' } | { __typename?: 'MovePage', id: any } };

export type GetPageInPagePageQueryVariables = Exact<{
  id: Scalars['PageId']['input'];
}>;


export type GetPageInPagePageQuery = { __typename?: 'QueryRoot', getPage: { __typename: 'GraphQLError' } | { __typename: 'Page', id: any, title: string, text: string } };

export type ListAncestorPagesQueryVariables = Exact<{
  id: Scalars['PageId']['input'];
}>;


export type ListAncestorPagesQuery = { __typename?: 'QueryRoot', listAncestorPages: { __typename: 'GraphQLError' } | { __typename: 'ListPages', items: Array<{ __typename?: 'Page', id: any, title: string }> } };

export type ListChannelQueryVariables = Exact<{ [key: string]: never; }>;


export type ListChannelQuery = { __typename?: 'QueryRoot', listChannel: Array<{ __typename?: 'Channel', id: any, name: any }> };

export type GetChannelQueryVariables = Exact<{
  id: Scalars['ChannelId']['input'];
}>;


export type GetChannelQuery = { __typename?: 'QueryRoot', getChannel: { __typename?: 'Channel', id: any, name: any, threads: Array<{ __typename?: 'Thread', id: any, messages: Array<{ __typename?: 'Message', id: any, text: string }> }> } };

export type AddMessageMutationVariables = Exact<{
  channelId: Scalars['ChannelId']['input'];
  text: Scalars['String']['input'];
}>;


export type AddMessageMutation = { __typename?: 'MutationRoot', addMessage: { __typename?: 'Message', id: any, text: string } };

export type GetThreadQueryVariables = Exact<{
  id: Scalars['ThreadId']['input'];
}>;


export type GetThreadQuery = { __typename?: 'QueryRoot', getThread: { __typename?: 'Thread', id: any, messages: Array<{ __typename?: 'Message', id: any, text: string }> } };

export type ReplyMutationVariables = Exact<{
  threadId: Scalars['ThreadId']['input'];
  text: Scalars['String']['input'];
}>;


export type ReplyMutation = { __typename?: 'MutationRoot', reply: { __typename?: 'Message', id: any, text: string } };


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
export function useHealthCheckSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<HealthCheckQuery, HealthCheckQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<HealthCheckQuery, HealthCheckQueryVariables>(HealthCheckDocument, options);
        }
export type HealthCheckQueryHookResult = ReturnType<typeof useHealthCheckQuery>;
export type HealthCheckLazyQueryHookResult = ReturnType<typeof useHealthCheckLazyQuery>;
export type HealthCheckSuspenseQueryHookResult = ReturnType<typeof useHealthCheckSuspenseQuery>;
export type HealthCheckQueryResult = Apollo.QueryResult<HealthCheckQuery, HealthCheckQueryVariables>;
export const ListRootPagesDocument = gql`
    query ListRootPages {
  listRootPages {
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
export function useListRootPagesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ListRootPagesQuery, ListRootPagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListRootPagesQuery, ListRootPagesQueryVariables>(ListRootPagesDocument, options);
        }
export type ListRootPagesQueryHookResult = ReturnType<typeof useListRootPagesQuery>;
export type ListRootPagesLazyQueryHookResult = ReturnType<typeof useListRootPagesLazyQuery>;
export type ListRootPagesSuspenseQueryHookResult = ReturnType<typeof useListRootPagesSuspenseQuery>;
export type ListRootPagesQueryResult = Apollo.QueryResult<ListRootPagesQuery, ListRootPagesQueryVariables>;
export const ListChildrenPagesDocument = gql`
    query ListChildrenPages($id: PageId!) {
  listChildrenPages(id: $id) {
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
 * __useListChildrenPagesQuery__
 *
 * To run a query within a React component, call `useListChildrenPagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListChildrenPagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListChildrenPagesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useListChildrenPagesQuery(baseOptions: Apollo.QueryHookOptions<ListChildrenPagesQuery, ListChildrenPagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListChildrenPagesQuery, ListChildrenPagesQueryVariables>(ListChildrenPagesDocument, options);
      }
export function useListChildrenPagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListChildrenPagesQuery, ListChildrenPagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListChildrenPagesQuery, ListChildrenPagesQueryVariables>(ListChildrenPagesDocument, options);
        }
export function useListChildrenPagesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ListChildrenPagesQuery, ListChildrenPagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListChildrenPagesQuery, ListChildrenPagesQueryVariables>(ListChildrenPagesDocument, options);
        }
export type ListChildrenPagesQueryHookResult = ReturnType<typeof useListChildrenPagesQuery>;
export type ListChildrenPagesLazyQueryHookResult = ReturnType<typeof useListChildrenPagesLazyQuery>;
export type ListChildrenPagesSuspenseQueryHookResult = ReturnType<typeof useListChildrenPagesSuspenseQuery>;
export type ListChildrenPagesQueryResult = Apollo.QueryResult<ListChildrenPagesQuery, ListChildrenPagesQueryVariables>;
export const AddPageDocument = gql`
    mutation AddPage($parentId: PageId, $addPage: AddPage!) {
  addPage(parentId: $parentId, addPage: $addPage) {
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
 *      parentId: // value for 'parentId'
 *      addPage: // value for 'addPage'
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
export const UpdatePageDocument = gql`
    mutation UpdatePage($id: PageId!, $updatePage: UpdatePage!) {
  updatePage(id: $id, updatePage: $updatePage) {
    ... on Page {
      id
      title
      text
    }
  }
}
    `;
export type UpdatePageMutationFn = Apollo.MutationFunction<UpdatePageMutation, UpdatePageMutationVariables>;

/**
 * __useUpdatePageMutation__
 *
 * To run a mutation, you first call `useUpdatePageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePageMutation, { data, loading, error }] = useUpdatePageMutation({
 *   variables: {
 *      id: // value for 'id'
 *      updatePage: // value for 'updatePage'
 *   },
 * });
 */
export function useUpdatePageMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePageMutation, UpdatePageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePageMutation, UpdatePageMutationVariables>(UpdatePageDocument, options);
      }
export type UpdatePageMutationHookResult = ReturnType<typeof useUpdatePageMutation>;
export type UpdatePageMutationResult = Apollo.MutationResult<UpdatePageMutation>;
export type UpdatePageMutationOptions = Apollo.BaseMutationOptions<UpdatePageMutation, UpdatePageMutationVariables>;
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
export const MovePageDocument = gql`
    mutation MovePage($id: PageId!, $target: MoveTarget!) {
  movePage(id: $id, target: $target) {
    ... on MovePage {
      id
    }
  }
}
    `;
export type MovePageMutationFn = Apollo.MutationFunction<MovePageMutation, MovePageMutationVariables>;

/**
 * __useMovePageMutation__
 *
 * To run a mutation, you first call `useMovePageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMovePageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [movePageMutation, { data, loading, error }] = useMovePageMutation({
 *   variables: {
 *      id: // value for 'id'
 *      target: // value for 'target'
 *   },
 * });
 */
export function useMovePageMutation(baseOptions?: Apollo.MutationHookOptions<MovePageMutation, MovePageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MovePageMutation, MovePageMutationVariables>(MovePageDocument, options);
      }
export type MovePageMutationHookResult = ReturnType<typeof useMovePageMutation>;
export type MovePageMutationResult = Apollo.MutationResult<MovePageMutation>;
export type MovePageMutationOptions = Apollo.BaseMutationOptions<MovePageMutation, MovePageMutationVariables>;
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
export function useGetPageInPagePageSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetPageInPagePageQuery, GetPageInPagePageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPageInPagePageQuery, GetPageInPagePageQueryVariables>(GetPageInPagePageDocument, options);
        }
export type GetPageInPagePageQueryHookResult = ReturnType<typeof useGetPageInPagePageQuery>;
export type GetPageInPagePageLazyQueryHookResult = ReturnType<typeof useGetPageInPagePageLazyQuery>;
export type GetPageInPagePageSuspenseQueryHookResult = ReturnType<typeof useGetPageInPagePageSuspenseQuery>;
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
export function useListAncestorPagesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ListAncestorPagesQuery, ListAncestorPagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListAncestorPagesQuery, ListAncestorPagesQueryVariables>(ListAncestorPagesDocument, options);
        }
export type ListAncestorPagesQueryHookResult = ReturnType<typeof useListAncestorPagesQuery>;
export type ListAncestorPagesLazyQueryHookResult = ReturnType<typeof useListAncestorPagesLazyQuery>;
export type ListAncestorPagesSuspenseQueryHookResult = ReturnType<typeof useListAncestorPagesSuspenseQuery>;
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
export function useListChannelSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ListChannelQuery, ListChannelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListChannelQuery, ListChannelQueryVariables>(ListChannelDocument, options);
        }
export type ListChannelQueryHookResult = ReturnType<typeof useListChannelQuery>;
export type ListChannelLazyQueryHookResult = ReturnType<typeof useListChannelLazyQuery>;
export type ListChannelSuspenseQueryHookResult = ReturnType<typeof useListChannelSuspenseQuery>;
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
export function useGetChannelSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetChannelQuery, GetChannelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetChannelQuery, GetChannelQueryVariables>(GetChannelDocument, options);
        }
export type GetChannelQueryHookResult = ReturnType<typeof useGetChannelQuery>;
export type GetChannelLazyQueryHookResult = ReturnType<typeof useGetChannelLazyQuery>;
export type GetChannelSuspenseQueryHookResult = ReturnType<typeof useGetChannelSuspenseQuery>;
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
export function useGetThreadSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetThreadQuery, GetThreadQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetThreadQuery, GetThreadQueryVariables>(GetThreadDocument, options);
        }
export type GetThreadQueryHookResult = ReturnType<typeof useGetThreadQuery>;
export type GetThreadLazyQueryHookResult = ReturnType<typeof useGetThreadLazyQuery>;
export type GetThreadSuspenseQueryHookResult = ReturnType<typeof useGetThreadSuspenseQuery>;
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