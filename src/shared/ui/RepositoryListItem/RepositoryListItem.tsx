import { Link } from 'react-router-dom';
import { RepositoryItem } from '@/types/RepositoryItem';
import styles from './RepositoryListItem.module.css';

type Props = {
    repo: RepositoryItem
};

export function RepositoryListItem({ repo }: Props) {
    return (
        <li key={repo.id} className={styles.repoItem}>
            <Link
                to={`/repository/${repo.owner.login}/${repo.name}`}
                className={styles.repoLink}
            >
                {repo.name}
            </Link>
            {' — '}
            ⭐ {repo.stargazerCount}
            {' — '}
            🕒 {new Date(repo.pushedAt).toLocaleDateString()}
        </li>
    );
}
