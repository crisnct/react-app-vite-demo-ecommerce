import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import {
  keepPreviousData,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 600_000, //millis
      retry: 5,
      retryDelay: 3000,
      staleTime: 10_000, //how much time data live in cache
      refetchOnReconnect: true, //refetch stale data when the internet connection is up again
      refetchOnWindowFocus: false, //refetch stale data when the user switch back to browser tab of the app
      refetchInterval: 60_000, // fetch automatically data every 60 sec
      placeholderData: keepPreviousData, // keep previous data as placeholder before retrieving new data from server
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools></ReactQueryDevtools>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
