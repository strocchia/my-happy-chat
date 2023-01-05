import React from "react";
import supabase from "../utils/supabase";
import { useRouter } from "next/router";

import { Auth, ThemeMinimal } from "@supabase/auth-ui-react";

export default function Login() {
  const router = useRouter();

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
      // alert("Check inbox for confirmation e-mail");

      // form.reset();
      // await router.push("/");

      const userReply = confirm("Check inbox for confirmation e-mail");
      if (userReply) {
        form.reset();
        router.push("/");
      }
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-4">
      {/* <Auth
        supabaseClient={supabase}
        view="magic_link"
        magicLink={true}
        showLinks={false}
        appearance={{ theme: ThemeMinimal }}
        theme="default"
      /> */}
      <form className="space-y-2" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xl font-semibold" htmlFor="email">
            Email
          </label>
          <input
            className="form-input w-full space-y-2"
            type="email"
            name="email"
            id="email"
          />
          <button type="submit">Sign in</button>
        </div>
      </form>
    </div>
  );
}
