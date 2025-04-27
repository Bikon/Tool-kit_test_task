import styles from './Paginator.module.css';

interface PaginatorProps {
    onNext: () => void;
    onPrev: () => void;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export function Paginator({ onNext, onPrev, hasNextPage, hasPreviousPage }: PaginatorProps) {
    return (
        <div className={styles.paginator}>
            <button
                className={styles.pageButton}
                onClick={onPrev}
                disabled={!hasPreviousPage}
            >
                ◀ Previous
            </button>
            <button
                className={styles.pageButton}
                onClick={onNext}
                disabled={!hasNextPage}
            >
                Next ▶
            </button>
        </div>
    );
}