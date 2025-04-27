import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_REPOSITORY } from '@/shared/api/github/queries';

export function RepositoryPage() {
    const { owner, name } = useParams();

    const { loading, data, error } = useQuery(GET_REPOSITORY, {
        variables: { owner, name },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const repo = data?.repository;

    return (
        <div>
            <h1>{repo?.name}</h1>
            <p>Stars: {repo?.stargazerCount}</p>
            <p>Last updated: {new Date(repo?.updatedAt).toLocaleDateString()}</p>
            <div>
                <img src={repo?.owner?.avatarUrl} alt={repo?.owner?.login} width="50" />
                <a href={repo?.owner?.url} target="_blank" rel="noopener noreferrer">
                    {repo?.owner?.login}
                </a>
            </div>
            <div>
                <h3>Languages:</h3>
                <ul>
                    {repo?.languages?.nodes.map((lang: any) => (
                        <li key={lang.name}>{lang.name}</li>
                    ))}
                </ul>
            </div>
            <p>{repo?.description}</p>
        </div>
    );
}