import { gql } from '@apollo/client';
import { REPOSITORY_FIELDS, PAGE_INFO_FIELDS } from './fragments';

// Поиск репозиториев
export const SEARCH_REPOSITORIES = gql`
  ${REPOSITORY_FIELDS}
  ${PAGE_INFO_FIELDS}

  query SearchRepositories(
    $query: String!
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    search(
      type: REPOSITORY
      query: $query
      first: $first
      after: $after
      last: $last
      before: $before
    ) {
      repositoryCount
      pageInfo {
        ...PageInfoFields
      }
      edges {
        node {
          ... on Repository {
            ...RepositoryFields
          }
        }
        cursor
      }
    }
  }
`;

// Получение одного репозитория
export const GET_REPOSITORY = gql`
  ${REPOSITORY_FIELDS}

  query GetRepository($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      ...RepositoryFields
      description
      languages(first: 10) {
        nodes {
          name
        }
      }
    }
  }
`;
