import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// ✅ Import React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ✅ Create a client (you can configure defaults here)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // avoid refetching every time you switch tabs
      retry: 1, // retry failed request only once
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* ✅ Provide React Query Client globally */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
