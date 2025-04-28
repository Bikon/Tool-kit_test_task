export type RepositoryItem = {
    id: string;
    name: string;
    stargazerCount: number;
    pushedAt: string;
    url?: string;
    owner: {
        login: string;
    };
};