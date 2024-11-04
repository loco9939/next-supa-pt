"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SignupInputs } from "./type";

export async function signup(data: SignupInputs) {
  const supabase = await createClient();

  const {
    username,
    password,
    email,
    phone,
    postalCode,
    address,
    detailAddress,
  } = data;

  // NOTE: 회원가입 시 받는 데이터 형식 handle_new_user 함수에도 반영해줘야 profiles 테이블에도 추가된다.
  // NOTE: 데이터베이스 column에는 대문자 불가!! snake_case 사용
  const { error: signupError } = await supabase.auth.signUp({
    email: `${username}-${email}`,
    password,
    options: {
      data: {
        username,
        email,
        phone,
        postal_code: postalCode,
        address,
        detail_address: detailAddress,
      },
    },
  });

  // 422: 이미 등록된 유저
  if (signupError) {
    console.log("Reqeust Data: ", data);
    console.error("Sign-up failed:", signupError.message);
    throw new Error("Failed to sign up. Please try again.");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function checkUsernameAvailability(username: string) {
  const supabase = await createClient();

  const { data, error: checkUsernameError } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", username)
    .maybeSingle();

  if (checkUsernameError) {
    console.error("check username failed:", checkUsernameError.message);
    throw new Error("Failed to sign up. Please try again.");
  }

  if (data) {
    return { isAvailable: false };
  } else {
    return { isAvailable: true };
  }
}
