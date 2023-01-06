import "../styles/globals.css";
import type { AppProps } from "next/app";
import React, { useState } from "react";
// import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { SessionContextProvider } from "../utils/AuthContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionContextProvider>
      <Component {...pageProps} />
    </SessionContextProvider>
  );
}

export default MyApp;
