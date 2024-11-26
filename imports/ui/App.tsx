import React, { Suspense } from "react";
import { Main } from "./Main";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Chat } from "./Chat";
const queryClient = new QueryClient();
export const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route
          index
          element={
            <div>
              <Suspense fallback={<h1>Loading...</h1>}>
                <Main />
              </Suspense>
            </div>
          }
        />

        <Route path="/chat/:chatId" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);
