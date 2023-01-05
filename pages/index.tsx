import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Messages from "../components/messages";
import supabase from "../utils/supabase";
import React, { useState, useEffect } from "react";
import { type User } from "@supabase/supabase-js";

const Home: NextPage = () => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user);
    }

    fetchUser();
  }, []);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT") {
          setUser(session?.user);
        }
        if (event === "SIGNED_IN") {
          if (!session || !session?.user) return;

          // check public.users table for existing user
          const { data: existingUser } = await supabase
            .from("users")
            .select()
            .eq("id", session?.user.id);

          if (existingUser?.length === 0) {
            console.log("got here");
            await supabase.from("users").insert([
              {
                username: session?.user.email,
                id: session?.user.id,
              },
            ]);
          }
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formdata = Object.fromEntries(new FormData(form));
    const { message } = formdata;

    if (typeof message !== "string") {
      form.reset();
      return;
    }

    if (message.trim().length === 0) {
      form.reset();
      return;
    }

    // const {
    //   data: { user },
    // } = await supabase.auth.getUser();

    // console.log(user);

    form.reset();

    const { error } = await supabase.from("messages").insert({
      message,
      // user_id: userId,
      user_id: user?.id,
      // user_id: (await supabase.auth.getUser()).data?.user?.id,
    });

    if (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Happy 🙂 Chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <main className="flex h-full w-full flex-1 flex-col items-stretch bg-blue-200 px-20"> */}
      <main className="flex w-5/6 flex-1 flex-col px-10 py-4 text-gray-900 bg-blue-100 text-center">
        {user ? (
          <button
            className="w-1/6 rounded mb-1 border border-red-500 p-1 hover:bg-pink-100"
            onClick={async () => {
              await supabase.auth.signOut();
              // window.location.reload();
            }}
          >
            Log out
          </button>
        ) : (
          <a
            className="w-1/6 mb-1 border border-green-500 rounded-lg p-1 hover:bg-pink-100"
            href="/login"
          >
            Sign in first
          </a>
        )}
        <h1 className="text-4xl bg-green-200 p-2">Happy Chat</h1>
        <Messages userId={user?.id} />
        <form
          onSubmit={handleSubmit}
          className="max w-full justify-self-end bg-red-200 p-2"
        >
          <input
            className="w-full rounded-md disabled:cursor-not-allowed"
            disabled={!user}
            type="text"
            name="message"
          />
        </form>
      </main>
    </div>
  );
};

export default Home;
