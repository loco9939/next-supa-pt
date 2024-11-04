"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function Header() {
  const supabase = createClient();

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
    } else {
      window.location.href = "/";
    }
  }

  return (
    <header className="p-4">
      <Link href="/mypage" className="bg-blue-500 text-white p-5">
        마이페이지
      </Link>
      <button className="bg-blue-500 text-white p-4 ml-2" onClick={signOut}>
        Log out
      </button>
    </header>
  );
}
