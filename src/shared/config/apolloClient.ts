import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: 'https://api.github.com/graphql',
});

const authLink = setContext((_, { headers }) => ({
    headers: {
        ...headers,
        authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
    },
}));

export const githubClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    search: {
                        keyArgs: ['query', 'type'],
                        read(existing, { args }) {
                            if (!existing) return undefined;

                            const pageSize = args?.first || args?.last || 10; // <-- динамический размер страницы

                            if (!args?.after && !args?.before) {
                                // первая страница
                                return {
                                    ...existing,
                                    edges: existing.edges.slice(0, pageSize),
                                };
                            }

                            if (args?.after) {
                                const startIndex = existing.edges.findIndex(
                                    (edge: any) => edge.cursor === args.after
                                );

                                if (startIndex !== -1) {
                                    return {
                                        ...existing,
                                        edges: existing.edges.slice(startIndex + 1, startIndex + 1 + pageSize),
                                    };
                                }
                            }

                            if (args?.before) {
                                const endIndex = existing.edges.findIndex(
                                    (edge: any) => edge.cursor === args.before
                                );

                                if (endIndex !== -1) {
                                    const startSlice = Math.max(0, endIndex - pageSize);
                                    return {
                                        ...existing,
                                        edges: existing.edges.slice(startSlice, endIndex),
                                    };
                                }
                            }

                            return undefined;
                        },
                        merge(existing = {}, incoming, { args }) {
                            if (!args?.after && !args?.before) {
                                // первая страница: перезаписываем
                                return incoming;
                            }

                            return {
                                ...incoming,
                                edges: [...(existing.edges || []), ...incoming.edges],
                            };
                        },
                    },
                },
            },
        },
    }),
});
