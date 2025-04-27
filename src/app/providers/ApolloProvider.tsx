import { ApolloProvider as Provider } from '@apollo/client';
import { githubClient } from '@/shared/api/github/graphqlClient';
import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

export function ApolloProvider({ children }: Props) {
    return <Provider client={githubClient}>{children}</Provider>;
}