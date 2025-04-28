import styles from './Modal.module.css';

type ModalType = 'success' | 'warning' | 'error';

interface ModalProps {
    type?: ModalType;
    message: string;
    onClose: () => void;
}

export function Modal({ type = 'success', message, onClose }: ModalProps) {
    return (
        <div className={`${styles.modal} ${styles[type]}`}>
            <button onClick={onClose} className={styles.closeButton}>✖</button>
            <span>{message}</span>
        </div>
    );
}
