import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { SEARCH_REPOSITORIES } from '@/shared/api/github/queries';
import { useStore } from 'effector-react'; // ✅ правильный импорт
import { $searchQuery, setSearchQuery, $page, setPage } from '@/store/searchStore';

export function HomePage() {
    const [query, setQuery] = useState('');
    const searchQuery = useStore($searchQuery);
    const page = useStore($page);

    const { loading, data, error } = useQuery(SEARCH_REPOSITORIES, {
        variables: { query: searchQuery || 'stars:>1', first: 10, after: null },
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => setSearchQuery(query), 500);
        return () => clearTimeout(timeoutId);
    }, [query]);

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder="Search GitHub Repositories"
            />
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            <ul>
                {data?.search?.edges.map((repo: any) => (
                    <li key={repo.node.name}>
                        <a href={`/repository/${repo.node.owner.login}/${repo.node.name}`}>
                            {repo.node.name}
                        </a>
                    </li>
                ))}
            </ul>
            <div>
                <button onClick={() => setPage(page - 1)} disabled={page <= 1}>
                    Previous
                </button>
                <button onClick={() => setPage(page + 1)}>
                    Next
                </button>
            </div>
        </div>
    );
}
