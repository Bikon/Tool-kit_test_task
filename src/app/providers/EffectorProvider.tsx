import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

export function EffectorProvider({ children }: Props) {
    return <>{children}</>;
}