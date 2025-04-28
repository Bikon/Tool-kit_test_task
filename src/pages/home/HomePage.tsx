import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useUnit } from 'effector-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SEARCH_REPOSITORIES } from '@/shared/api/github/queries';
import { $searchQuery, setSearchQuery } from '@/store/searchStore';
import { Loader } from '@/shared/ui/Loader/Loader';
import { ErrorMessage } from '@/shared/ui/ErrorMessage/ErrorMessage';
import { Paginator } from '@/shared/ui/Paginator/Paginator';
import { Modal } from '@/shared/ui/Modal/Modal';
import styles from './HomePage.module.css';

export function HomePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const initialQuery = searchParams.get('query') || '';
    const initialPage = parseInt(searchParams.get('page') || '1', 10);

    const [query, setQuery] = useState(initialQuery);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [perPage, setPerPage] = useState(10);
    const [lastCursor, setLastCursor] = useState<string | null>(null);
    const [searchQuery] = useUnit([$searchQuery]);

    const [showModal, setShowModal] = useState(true);
    const [modalType, setModalType] = useState<'success' | 'warning' | 'error'>('warning');
    const [modalMessage, setModalMessage] = useState('');

    const { loading, data, error, refetch, networkStatus } = useQuery(SEARCH_REPOSITORIES, {
        variables: {
            query: searchQuery || 'stars:>1',
            first: perPage,
            after: lastCursor,
        },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-first',
    });

    const totalCount = data?.search?.repositoryCount || 0;
    const totalPages = Math.min(Math.ceil(totalCount / perPage), 10);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handlePageChange = async (page: number) => {
        if (page > currentPage && data?.search?.pageInfo?.endCursor) {
            setLastCursor(data.search.pageInfo.endCursor);
        } else if (page < currentPage) {
            setLastCursor(null);
        }

        setCurrentPage(page);
        setSearchParams({ query: searchQuery, page: page.toString() });

        await refetch({
            query: searchQuery || 'stars:>1',
            first: perPage,
            after: page === 1 ? null : lastCursor,
        });
    };

    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPerPage = parseInt(e.target.value, 10);
        setPerPage(newPerPage);
        setLastCursor(null);
        setCurrentPage(1);

        setSearchParams({ query: searchQuery, page: '1' });

        refetch({
            query: searchQuery || 'stars:>1',
            first: newPerPage,
            after: null,
        });
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setLastCursor(null);
            setCurrentPage(1);
            setSearchQuery(query);

            setSearchParams({ query, page: '1' });
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [query]);

    useEffect(() => {
        if (error) {
            setModalType('error');
            setModalMessage(`Ошибка запроса: ${error.message}`);
            setShowModal(true);
        }
    }, [error]);

    useEffect(() => {
        if (showModal && modalMessage === '') {
            setModalMessage('📢 В целях оптимизации, максимальное количество страниц ограничено до 10. GitHub содержит десятки тысяч репозиториев, поэтому мы загружаем только часть для повышения скорости работы.');
        }
    }, [showModal, modalMessage]);

    return (
        <div className={styles.container}>
            {showModal && (
                <Modal
                    type={modalType}
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

            {(loading || networkStatus === 4) && <Loader />}

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

            {totalPages > 1 && (
                <div className={styles.paginationControls}>
                    <Paginator
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />

                    <div className={styles.perPageSelector}>
                        <label htmlFor="perPage">Показывать: </label>
                        <select id="perPage" value={perPage} onChange={handlePerPageChange}>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
}
