import "../styles/globals.css";
import type { AppProps } from "next/app";
import React, { useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";

function MyApp({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return <Component {...pageProps} />;
}

export default MyApp;
