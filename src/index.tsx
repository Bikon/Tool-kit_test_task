import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App';
import { ApolloProvider } from './app/providers/ApolloProvider';
import { EffectorProvider } from './app/providers/EffectorProvider';

import './styles/globals.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <EffectorProvider>
            <ApolloProvider>
                <App />
            </ApolloProvider>
        </EffectorProvider>
    </React.StrictMode>,
);
