import { useWindowSize } from '@/shared/lib/hooks/useWindowSize';
import styles from './Paginator.module.css';

interface PaginatorProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Paginator({ currentPage, totalPages, onPageChange }: PaginatorProps) {
    const { width } = useWindowSize();
    const isMobile = width <= 600;

    const generatePages = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            pages.push(totalPages);
        }

        return pages;
    };

    const pages = generatePages();

    return (
        <div className={styles.paginator}>
            <button
                className={styles.arrowButton}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                ◀
            </button>

            {!isMobile &&
                pages.map((page, idx) =>
                        typeof page === 'number' ? (
                            <button
                                key={idx}
                                onClick={() => onPageChange(page)}
                                className={`${styles.pageButton} ${page === currentPage ? styles.activePage : ''}`}
                            >
                                {page}
                            </button>
                        ) : (
                            <span key={idx} className={styles.dots}>
              {page}
            </span>
                        )
                )}

            <button
                className={styles.arrowButton}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                ▶
            </button>
        </div>
    );
}
