import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { GlobalStateProvider } from "./context/GlobalStateProvider.tsx";
import { Web3AuthProvider } from "./context/Web3AuthProvider.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="1092218688311-k1qb4en1iipoc70g375habe27aau2vok.apps.googleusercontent.com">
      <GlobalStateProvider>
        <Web3AuthProvider>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </Web3AuthProvider>
      </GlobalStateProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
