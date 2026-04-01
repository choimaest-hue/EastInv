const REQUIRED_ENV_VARS = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function getClientIp(request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
}

export default async function handler(request) {
  if (request.method !== "POST") {
    return json(405, { ok: false, error: "method_not_allowed" });
  }

  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    return json(503, { ok: false, error: "missing_env", missing });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json(400, { ok: false, error: "invalid_json" });
  }

  const role = typeof payload.role === "string" ? payload.role : "";
  const method = typeof payload.method === "string" ? payload.method : "";
  const language = typeof payload.language === "string" ? payload.language : "";
  const page = typeof payload.page === "string" ? payload.page : "";

  if (!role || !method) {
    return json(400, { ok: false, error: "missing_required_fields" });
  }

  const insertPayload = {
    role,
    method,
    language: language || null,
    page: page || null,
    user_agent: request.headers.get("user-agent"),
    referrer: request.headers.get("referer"),
    client_ip: getClientIp(request),
    created_at: new Date().toISOString()
  };

  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/inquiry_logs`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: "return=minimal"
      },
      body: JSON.stringify(insertPayload)
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    return json(502, { ok: false, error: "supabase_insert_failed", details: errorText });
  }

  return json(200, { ok: true });
}