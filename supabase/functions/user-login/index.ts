// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
  try {
    const { identifier, password } = await req.json();
    if (typeof identifier !== "string" || typeof password !== "string") {
      throw new Error("Invalid login credentials");
    }

    const email = await getEmail(identifier);
    if (!email) {
      throw new Error("Invalid login credentials");
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw error;
    }

    return jsonResponse(data, 200);
  } catch (error) {
    return jsonResponse({ error: error.message }, error.status ?? 400);
  }
});

/**
 * Retrieve email by identifier (email or username).
 * @param {string} identifier - The email or username.
 * @returns {Promise<string | undefined>} The email address or undefined if not found.
 */
async function getEmail(identifier: string): Promise<string | undefined> {
  if (identifier.includes("@")) {
    return identifier;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("username", identifier)
    .single();

  if (!profile?.user_id) {
    return undefined;
  }

  const { data: user } = await supabase.auth.admin.getUserById(profile.user_id);
  return user.user!.email;
}

/**
 * Helper function to create JSON responses.
 * @param {object} body - The response body.
 * @param {number} status - The HTTP status code.
 * @returns {Response} The HTTP response.
 */
function jsonResponse(body: object, status: number): Response {
  return new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
    status,
  });
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/login' \
    --header 'Content-Type: application/json' \
    --data '{"identifier":"username","password":"password"}'

*/
