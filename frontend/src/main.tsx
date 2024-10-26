import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import store from "@/Redux/sessionSlice";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "@/darktheme/CustomTheme";

// Create a new query client

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Provider store={store}>
        <React.StrictMode>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            {" "}
            <App />
          </ThemeProvider>
        </React.StrictMode>
      </Provider>
    </BrowserRouter>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
