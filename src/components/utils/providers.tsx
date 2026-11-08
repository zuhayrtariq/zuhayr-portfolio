"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Toaster } from '../ui/sonner';

const Providers = ({
    children
}: {
    children: React.ReactNode
}) => {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <Toaster
                theme="dark"
                position="top-center"
            />
            {children}
        </QueryClientProvider>
    )
};

export default Providers;
