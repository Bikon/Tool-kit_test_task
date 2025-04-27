import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
    message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
    return (
        <div className={styles.errorContainer}>
            <p className={styles.errorText}>⚠️ {message}</p>
        </div>
    );
}