import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
	defaultOptions: {
	  queries: {
		staleTime: 1000 * 60 * 5, // 5 minutes
		cacheTime: 1000 * 60 * 10, // 10 minutes
		refetchOnWindowFocus: false,
	  },
	},
  });

const ReactQuery = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQuery;
