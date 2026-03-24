import { promises as fs } from "fs";
import path from "path";

const FILE = path.join("/tmp", "scores.json");

export default async (req, context) => {
  const method = req.method;

  // Datei anlegen, falls sie nicht existiert
  try {
    await fs.access(FILE);
  } catch {
    await fs.writeFile(FILE, "[]");
  }

  if (method === "POST") {
    const body = await req.json();
    const data = JSON.parse(await fs.readFile(FILE, "utf8"));

    data.push({
      ...body,
      timestamp: Date.now()
    });

    await fs.writeFile(FILE, JSON.stringify(data, null, 2));

    return new Response(JSON.stringify({ status: "ok" }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  if (method === "GET") {
    const data = JSON.parse(await fs.readFile(FILE, "utf8"));
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response("Method not allowed", { status: 405 });
};

