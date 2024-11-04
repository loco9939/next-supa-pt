export default function Home() {
  return <>Home Page</>;
}

// import { createClient } from "@/utils/supabase/server";

// export default async function Home() {
//   const supabase = await createClient();
//   const user = await supabase.auth.getUser();
//   return (
//     <div>
//       Home Page
//       <p>hi ! {user.data.user?.user_metadata.username}님 환영합니다.</p>
//     </div>
//   );
// }
