import { withSupabase } from "npm:@supabase/server@1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: corsHeaders });

const handler = withSupabase({ auth: "user" }, async (request, ctx) => {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const { data: isAdmin, error: accessError } = await ctx.supabase.rpc("is_store_admin");
    if (accessError) return json({ error: "Could not verify store admin access." }, 500);
    if (!isAdmin) return json({ error: "Only an existing store admin can create another admin." }, 403);

    const input = await request.json();
    const email = String(input.email || "").trim().toLowerCase();
    const password = String(input.password || "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Enter a valid email address." }, 400);
    if (password.length < 8) return json({ error: "Temporary password must be at least 8 characters." }, 400);

    const { data: created, error: createError } = await ctx.supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createError || !created.user) {
      return json({ error: createError?.message || "Could not create the account." }, 400);
    }

    const { error: grantError } = await ctx.supabaseAdmin.from("admin_users").insert({ user_id: created.user.id });
    if (grantError) {
      await ctx.supabaseAdmin.auth.admin.deleteUser(created.user.id);
      return json({ error: "Admin access could not be assigned. The incomplete account was removed; try again." }, 500);
    }

    return json({ id: created.user.id, email: created.user.email });
  } catch (_error) {
    return json({ error: "Could not create the admin account. Check the function logs and configuration." }, 500);
  }
});

Deno.serve((request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  return handler(request);
});
