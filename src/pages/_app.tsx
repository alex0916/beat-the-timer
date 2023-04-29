import type { AppProps } from 'next/app';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import '@src/styles/globals.css';
//theme
import 'primereact/resources/themes/md-dark-indigo/theme.css';
//core
import 'primereact/resources/primereact.min.css';
//icons
import 'primeicons/primeicons.css';
import '/node_modules/primeflex/primeflex.css';

import { RoomContextProvider } from '@src/contexts';
import { Layout, RoomHandler } from '@src/components';

export default function App({ Component, pageProps }: AppProps) {
	const [supabaseClient] = useState(() => createBrowserSupabaseClient());
	const queryClient = new QueryClient();

	return (
		<SessionContextProvider
			supabaseClient={supabaseClient}
			initialSession={pageProps.initialSession}
		>
			<QueryClientProvider client={queryClient}>
				<RoomContextProvider>
					<Layout>
						<RoomHandler>
							<Component {...pageProps} />
						</RoomHandler>
					</Layout>
				</RoomContextProvider>
			</QueryClientProvider>
		</SessionContextProvider>
	);
}
