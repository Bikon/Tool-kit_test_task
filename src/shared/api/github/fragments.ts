import { gql } from '@apollo/client';

export const REPOSITORY_FRAGMENT = gql`
  fragment RepositoryFragment on Repository {
    id
    name
    url
    stargazerCount
    pushedAt
    owner {
      login
    }
  }
`;

export const REPOSITORY_FIELDS = gql`
  fragment RepositoryFields on Repository {
    id
    name
    stargazerCount
    updatedAt
    url
    owner {
      login
      avatarUrl
      url
    }
  }
`;
