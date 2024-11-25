import React, { Suspense } from "react";
import { Hello } from "./Hello";
import { Info } from "./Info";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
export const App = () => (
  <QueryClientProvider client={queryClient}>
    <div>
      <h1>Welcome to Meteor!</h1>
      <Suspense fallback={<h1>Loading...</h1>}>
        <Hello />
      </Suspense>
      <Info />
    </div>
  </QueryClientProvider>
);
