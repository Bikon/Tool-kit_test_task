import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useUnit } from 'effector-react';
import { useSearchParams } from 'react-router-dom';
import { SEARCH_REPOSITORIES } from '@/shared/api/github/queries';
import { $searchQuery, setSearchQuery, $page, setPage, resetPagination } from '@/store/searchStore';
import { Loader } from '@/shared/ui/Loader/Loader';
import { Modal } from '@/shared/ui/Modal/Modal';
import { Paginator } from '@/shared/ui/Paginator/Paginator';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

// Константы
const MAX_TOTAL_ITEMS = 500;
const DEFAULT_ITEMS_PER_PAGE = 10;
const DEFAULT_MAX_PAGES = 10;
const TOTAL_ITEMS_TO_LOAD = Math.min(DEFAULT_ITEMS_PER_PAGE * DEFAULT_MAX_PAGES, MAX_TOTAL_ITEMS);

export function HomePage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [searchQuery] = useUnit([$searchQuery]);
    const [currentPage] = useUnit([$page]);
    const [query, setQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const { data, loading, error, networkStatus } = useQuery(SEARCH_REPOSITORIES, {
        variables: {
            query: searchQuery || 'stars:>1',
            first: TOTAL_ITEMS_TO_LOAD,
        },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'network-only',
    });

    const availableEdges = data?.search?.edges || [];
    const totalPages = Math.min(Math.ceil(availableEdges.length / DEFAULT_ITEMS_PER_PAGE), DEFAULT_MAX_PAGES);

    // При первом монтировании: подтянуть query и page из URL
    useEffect(() => {
        const initialQuery = searchParams.get('query') || '';
        const initialPage = Number(searchParams.get('page') || '1');

        setQuery(initialQuery);
        setSearchQuery(initialQuery);

        if (!isNaN(initialPage) && initialPage > 0) {
            setPage(initialPage);
        }
    }, []);

    // При изменении текстового поиска (пользователь вводит текст)
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (query !== searchQuery) {
                setSearchQuery(query);
                resetPagination();
                setPage(1);
                setSearchParams({ query, page: '1' });
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [query]);

    // Обработка ошибок
    useEffect(() => {
        if (error) {
            setModalMessage(`Ошибка запроса: ${error.message}`);
            setShowModal(true);
        }
    }, [error]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handlePageChange = (page: number) => {
        setPage(page);
        setSearchParams({ query: searchQuery, page: page.toString() });
    };

    return (
        <div className={styles.container}>
            {showModal && (
                <Modal
                    type="error"
                    message={modalMessage}
                    onClose={() => setShowModal(false)}
                />
            )}

            <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                className={styles.searchInput}
                placeholder="Search GitHub Repositories"
            />

            {(loading && networkStatus !== 7) && <Loader />}

            {/* Показываем только после загрузки и без ошибок */}
            {!loading && !error && (
                <ul className={styles.repoList}>
                    {availableEdges
                        .slice((currentPage - 1) * DEFAULT_ITEMS_PER_PAGE, currentPage * DEFAULT_ITEMS_PER_PAGE)
                        .map((repo: any) => (
                            <li key={repo.node.id} className={styles.repoItem}>
                                <Link
                                    to={`/repository/${repo.node.owner.login}/${repo.node.name}`}
                                    className={styles.repoLink}
                                >
                                    {repo.node.name}
                                </Link>
                                {' — '}
                                ⭐ {repo.node.stargazerCount}
                                {' — '}
                                🕒 {new Date(repo.node.pushedAt).toLocaleDateString()}
                            </li>
                        ))}
                </ul>
            )}

            {totalPages > 1 && (
                <div className={styles.paginationControls}>
                    <Paginator
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}
