import React, { useState } from "react";
import supabase from "../utils/supabase";
import { useRouter } from "next/router";

import { Auth, ThemeMinimal } from "@supabase/auth-ui-react";

export default function Login() {
  const router = useRouter();

  const [statusText, setStatusText] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formdata = Object.fromEntries(new FormData(form));
    const { email } = formdata;

    if (!email || typeof email !== "string") return;

    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (data) {
      setStatusText("Check inbox for confirmation e-mail");

      form.reset();
      // router.push("/");
    }
  };

  return (
    <div className="mx-auto flex flex-col min-h-screen max-w-2xl items-center justify-center px-4">
      {/* <Auth
        supabaseClient={supabase}
        view="magic_link"
        magicLink={true}
        showLinks={false}
        appearance={{ theme: ThemeMinimal }}
        theme="default"
      /> */}
      <form className="space-y-2" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <label className="block text-xl font-semibold" htmlFor="email">
            Email
          </label>
          <input
            className="form-input w-full"
            type="email"
            name="email"
            id="email"
          />
          <button
            className="my-2 border border-neutral-500 rounded-md px-2 py-1"
            type="submit"
          >
            Sign in
          </button>
        </div>
      </form>
      {statusText && (
        <>
          <p className="mt-10 text-emerald-600 font-semibold italic">
            {statusText}
          </p>
          <a className="underline hover:no-underline duration-200" href="/">
            Go Home
          </a>
        </>
      )}
    </div>
  );
}
