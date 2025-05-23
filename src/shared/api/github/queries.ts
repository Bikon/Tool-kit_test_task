import { gql } from '@apollo/client';
import { REPOSITORY_FRAGMENT, REPOSITORY_FIELDS } from './fragments';

export const SEARCH_REPOSITORIES = gql`
  ${REPOSITORY_FRAGMENT}
  
  query SearchRepositories($query: String!, $first: Int!) {
    search(
      query: $query
      type: REPOSITORY
      first: $first
    ) {
      repositoryCount
      edges {
        node {
          ...RepositoryFragment
        }
      }
    }
  }
`;

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

export const GET_USER_REPOSITORIES = gql`
  query GetUserRepositories($first: Int!) {
    viewer {
      repositories(first: $first, orderBy: { field: UPDATED_AT, direction: DESC }) {
        nodes {
          id
          name
          url
          stargazerCount
          pushedAt
          owner {
            login
          }
        }
      }
    }
  }
`;
