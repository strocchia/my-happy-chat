import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Messages from "../components/messages";
import supabase from "../utils/supabase";
import React, { useState, useEffect } from "react";
import { useSession, useUser } from "../utils/AuthContext";

const Home: NextPage = () => {
  const user = useUser();

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

    form.reset();

    const { error } = await supabase.from("messages").insert({
      message,
      user_id: user?.id,
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
      <main className="flex h-full w-full flex-1 flex-col items-stretch px-10 py-3 text-gray-900 bg-blue-100 text-center">
        <div className="w-11/12 mx-auto flex flex-col flex-1 justify-center">
          {user ? (
            <div className="w-1/2 text-left mb-2">
              <span className="mx-4 text-sm">Hello, {user.email}</span>
              <button
                className="rounded border border-red-500 px-3 py-1 hover:bg-pink-100 hover:border-red-700"
                onClick={async () => {
                  await supabase.auth.signOut();
                }}
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="w-1/2 text-left mb-2">
              <span className="mr-2 font-bold">=={">"}</span>
              <a
                className="border border-green-500 rounded-lg px-3 py-1 hover:bg-pink-100 hover:border-green-800"
                href="/login"
              >
                Sign in
              </a>
            </div>
          )}
          <h1 className="text-4xl bg-green-200 p-2">Happy Chat</h1>
          <Messages />
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
        </div>
      </main>
    </div>
  );
};

export default Home;
