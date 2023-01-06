import {
  AuthError,
  Session,
  SupabaseClient,
  User,
} from "@supabase/supabase-js";
import React, {
  useContext,
  useMemo,
  useState,
  useEffect,
  createContext,
  ReactNode,
  PropsWithChildren,
} from "react";
import { default as supabaseClient } from "./supabase";

export type SessionContext =
  | {
      isLoading: true;
      session: null;
      error: null;
      // supabaseClient: SupabaseClient;
    }
  | {
      isLoading: false;
      session: Session;
      error: null;
      // supabaseClient: SupabaseClient;
    }
  | {
      isLoading: false;
      session: null;
      error: AuthError;
      // supabaseClient: SupabaseClient;
    }
  | {
      isLoading: false;
      session: null;
      error: null;
      // supabaseClient: SupabaseClient;
    };

const SessionContext = createContext<SessionContext>({
  isLoading: true,
  session: null,
  error: null,
  // supabaseClient: SupabaseClient;
});

// export interface SessionContextProviderProps {
//   supabaseClient: SupabaseClient;
//   initialSession?: Session | null;
// }

export const SessionContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError>();

  useEffect(() => {
    let mounted = true;

    async function getSession() {
      const {
        data: { session },
        error,
      } = await supabaseClient.auth.getSession();

      // only update the react state if the component is still mounted
      if (mounted) {
        if (error) {
          setError(error);
          setIsLoading(false);
          return;
        }

        setSession(session);
        setIsLoading(false);
      }
    }

    getSession();
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if (session && (event === "SIGNED_IN" || event === "TOKEN_REFRESHED")) {
        setSession(session);

        const { data: existingUser } = await supabaseClient
          .from("users")
          .select()
          .eq("id", session.user.id);

        if (existingUser?.length === 0) {
          await supabaseClient.from("users").insert([
            {
              username: session.user.email,
              id: session.user.id,
            },
          ]);
        }
      }

      if (event === "SIGNED_OUT") {
        setSession(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value: SessionContext = useMemo(() => {
    if (isLoading) {
      return {
        isLoading: true,
        session: null,
        error: null,
        // supabaseClient,
      };
    }

    if (error) {
      return {
        isLoading: false,
        session: null,
        error,
        // supabaseClient,
      };
    }

    return {
      isLoading: false,
      session,
      error: null,
      // supabaseClient,
    };
  }, [isLoading, session, error]);

  return (
    <SessionContext.Provider value={value}>
      {!isLoading && children}
    </SessionContext.Provider>
  );
};

// export the useSessionContext hook
export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error(
      `useSessionContext must be used within a SessionContextProvider.`
    );
  }

  return context;
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error(`useSession must be used within a SessionContextProvider.`);
  }

  return context.session; // ?? null;
};

export const useUser = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a SessionContextProvider.`);
  }

  return context.session?.user ?? null;
};
