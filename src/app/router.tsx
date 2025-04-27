import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '@/pages/home/HomePage';
import { RepositoryPage } from '@/pages/repository/RepositoryPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/repository/:owner/:name',
        element: <RepositoryPage />,
    },
]);