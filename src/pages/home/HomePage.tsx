import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useUnit } from 'effector-react';
import { SEARCH_REPOSITORIES } from '@/shared/api/github/queries';
import { $searchQuery, setSearchQuery } from '@/store/searchStore';
import { Loader } from '@/shared/ui/Loader/Loader';
import { ErrorMessage } from '@/shared/ui/ErrorMessage/ErrorMessage';
import { Paginator } from '@/shared/ui/Paginator/Paginator';
import styles from './HomePage.module.css';

export function HomePage() {
    const [query, setQuery] = useState('');
    const [afterCursor, setAfterCursor] = useState<string | null>(null);
    const [beforeCursor, setBeforeCursor] = useState<string | null>(null);
    const [isNext, setIsNext] = useState(true); // Запоминаем направление перехода
    const [searchQuery] = useUnit([$searchQuery]);

    const { loading, data, error, refetch } = useQuery(SEARCH_REPOSITORIES, {
        variables: {
            query: searchQuery || 'stars:>1',
            first: isNext ? 10 : undefined,
            after: isNext ? afterCursor : undefined,
            last: !isNext ? 10 : undefined,
            before: !isNext ? beforeCursor : undefined,
        },
        notifyOnNetworkStatusChange: true,
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setAfterCursor(null);
            setBeforeCursor(null);
            setSearchQuery(query);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleNextPage = () => {
        if (data?.search?.pageInfo?.endCursor) {
            setIsNext(true);
            setAfterCursor(data.search.pageInfo.endCursor);
            setBeforeCursor(null);
        }
    };

    const handlePrevPage = () => {
        if (data?.search?.pageInfo?.startCursor) {
            setIsNext(false);
            setBeforeCursor(data.search.pageInfo.startCursor);
            setAfterCursor(null);
        }
    };

    return (
        <div className={styles.container}>
            <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                className={styles.searchInput}
                placeholder="Search GitHub Repositories"
            />

            {loading && <Loader />}
            {error && <ErrorMessage message={error.message} />}

            <ul className={styles.repoList}>
                {data?.search?.edges.map((repo: any) => (
                    <li key={repo.node.id} className={styles.repoItem}>
                        <a
                            href={`/repository/${repo.node.owner.login}/${repo.node.name}`}
                            className={styles.repoLink}
                        >
                            {repo.node.name}
                        </a>
                    </li>
                ))}
            </ul>

            {data && (
                <Paginator
                    onNext={handleNextPage}
                    onPrev={handlePrevPage}
                    hasNextPage={data.search.pageInfo.hasNextPage}
                    hasPreviousPage={data.search.pageInfo.hasPreviousPage}
                />
            )}
        </div>
    );
}
