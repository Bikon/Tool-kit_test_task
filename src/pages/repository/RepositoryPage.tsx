import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_REPOSITORY } from '@/shared/api/github/queries';
import { Loader } from '@/shared/ui/Loader/Loader';
import { ErrorMessage } from '@/shared/ui/ErrorMessage/ErrorMessage';
import styles from './RepositoryPage.module.css';

export function RepositoryPage() {
    const { owner, name } = useParams<{ owner: string; name: string }>();

    const { loading, data, error } = useQuery(GET_REPOSITORY, {
        variables: { owner, name },
    });

    if (loading) return <Loader />;
    if (error) return <ErrorMessage message={error.message} />;

    const repo = data?.repository;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img src={repo?.owner?.avatarUrl} alt={repo?.owner?.login} className={styles.avatar} />
                <a href={repo?.owner?.url} target="_blank" rel="noopener noreferrer" className={styles.ownerLink}>
                    {repo?.owner?.login}
                </a>
            </div>
            <h1>{repo?.name}</h1>
            <p>⭐ {repo?.stargazerCount} stars</p>
            <p>Last updated: {new Date(repo?.updatedAt).toLocaleDateString()}</p>

            <div className={styles.languages}>
                {repo?.languages?.nodes.map((lang: any) => (
                    <span key={lang.name} className={styles.languageItem}>
            {lang.name}
          </span>
                ))}
            </div>

            <p className={styles.description}>{repo?.description}</p>
        </div>
    );
}
