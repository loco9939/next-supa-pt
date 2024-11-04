"use server";

import { createClient } from "@/utils/supabase/server";
import { LoginInputs } from "./type";

export async function login(data: LoginInputs) {
  const supabase = await createClient();

  const { username, password } = data;

  // const res = await supabase.functions.invoke("user-login", { body: username });

  const { data: profile } = await supabase
    .from("profiles")
    .select("email")
    .eq("username", username)
    .single();

  // 조회된 이메일과 패스워드로 로그인
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email: `${username}-${profile?.email}`,
    password,
  });

  if (loginError) {
    throw new Error("Login failed. Please check your ID and password.");
  }

  return null;
}
