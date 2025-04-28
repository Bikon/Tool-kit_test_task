import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useUnit } from 'effector-react';
import { useSearchParams, Link } from 'react-router-dom';
import { SEARCH_REPOSITORIES } from '@/shared/api/github/queries';
import { GET_USER_REPOSITORIES } from '@/shared/api/github/queries';
import { $searchQuery, setSearchQuery, $page, setPage, resetPagination } from '@/store/searchStore';
import { RepositoryItem } from '@/types/RepositoryItem';
import { Loader } from '@/shared/ui/Loader/Loader';
import { Modal } from '@/shared/ui/Modal/Modal';
import { RepositoryListItem } from '@/shared/ui/RepositoryListItem/RepositoryListItem';
import { Paginator } from '@/shared/ui/Paginator/Paginator';
import styles from './HomePage.module.css';

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
    const [cachedEdges, setCachedEdges] = useState<any[]>([]);

    const { data: searchData, loading: searchLoading, error: searchError } = useQuery(SEARCH_REPOSITORIES, {
        variables: {
            query: searchQuery || 'stars:>1',
            first: TOTAL_ITEMS_TO_LOAD,
        },
        skip: !query.length,
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'network-only',
    });

    const { data: viewerData, loading: viewerLoading, error: viewerError } = useQuery(GET_USER_REPOSITORIES, {
        variables: { first: TOTAL_ITEMS_TO_LOAD },
        skip: !!query.length, // если есть текст поиска — не запрашиваем viewer
        fetchPolicy: 'network-only',
    });

    const isLoading = query.length > 0 ? searchLoading : viewerLoading;
    const isError = query.length > 0 ? searchError : viewerError;

    const searchEdges = cachedEdges.length > 0 ? cachedEdges : (searchData?.search?.edges || []);
    const viewerEdges: RepositoryItem[] = viewerData?.viewer?.repositories?.nodes || [];

    const availableEdges: RepositoryItem[] = query.length > 0 ? searchEdges?.map((item: any) => item.node) : viewerEdges;

    const totalPages = Math.min(Math.ceil(availableEdges.length / DEFAULT_ITEMS_PER_PAGE), DEFAULT_MAX_PAGES);

    useEffect(() => {
        const initialQuery = searchParams.get('query') || '';
        const initialPage = Number(searchParams.get('page') || '1');

        setQuery(initialQuery);
        setSearchQuery(initialQuery);

        if (!isNaN(initialPage) && initialPage > 0) {
            setPage(initialPage);
        }

        const cachedData = sessionStorage.getItem('github_repositories');
        if (cachedData) {
            try {
                setCachedEdges(JSON.parse(cachedData));
            } catch {
                sessionStorage.removeItem('github_repositories');
            }
        }
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (query !== searchQuery) {
                setSearchQuery(query);
                resetPagination();
                setPage(1);
                setSearchParams({ query, page: '1' });
                sessionStorage.removeItem('github_repositories');
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [query]);

    useEffect(() => {
        if (searchData?.search?.edges) {
            sessionStorage.setItem('github_repositories', JSON.stringify(searchData.search.edges));
        }
    }, [searchData]);

    useEffect(() => {
        if (isError) {
            setModalMessage(`Ошибка запроса: ${isError.message}`);
            setShowModal(true);
        }
    }, [isError]);

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

            {isLoading && <Loader />}

            {!isLoading && !isError && (
                <ul className={styles.repoList}>
                    {availableEdges
                        .slice((currentPage - 1) * DEFAULT_ITEMS_PER_PAGE, currentPage * DEFAULT_ITEMS_PER_PAGE)
                        .map((repo: RepositoryItem) => (
                            <RepositoryListItem key={repo.id} repo={repo}/>
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
