import { NextResponse } from "next/server";

export const revalidate = 3600;

async function countTable(url: string, key: string, table: string): Promise<number> {
  try {
    const res = await fetch(`${url}/rest/v1/${table}?select=*&limit=1`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: "count=exact",
      },
      cache: "no-store",
    });
    const count = res.headers.get("content-range");
    if (count) {
      const total = count.split("/")[1];
      return parseInt(total, 10) || 0;
    }
    return 0;
  } catch {
    return 0;
  }
}

export async function GET() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;

  if (!url || !key) {
    return NextResponse.json({ servers: 500, tickets: 10000, uptime: 99, commands: 8 });
  }

  const [servers, tickets] = await Promise.all([
    countTable(url, key, "server_builds"),
    countTable(url, key, "tickets"),
  ]);

  return NextResponse.json({
    servers: Math.max(servers, 1),
    tickets: Math.max(tickets, 1),
    uptime: 99,
    commands: 8,
  });
}
