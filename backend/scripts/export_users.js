#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { sql } from "../db/connection.js";

function toCsv(rows) {
  if (!rows || rows.length === 0) return "";
  const keys = Object.keys(rows[0]);
  const escape = (v) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    if (s.includes('"') || s.includes(',') || s.includes('\n') || s.includes('\r')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const header = keys.join(",");
  const lines = rows.map(r => keys.map(k => escape(r[k])).join(","));
  return [header, ...lines].join("\n");
}

async function main() {
  try {
    console.log("Consultando tabla 'usuarios'...");
    const rows = await sql`SELECT * FROM usuarios ORDER BY id`;

    if (!rows || rows.length === 0) {
      console.log("La tabla 'usuarios' no tiene filas.");
      return;
    }

    const outDir = path.resolve("backend", "exports");
    await fs.promises.mkdir(outDir, { recursive: true });
    const now = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = path.join(outDir, `usuarios_export_${now}.csv`);

    const csv = toCsv(rows);
    await fs.promises.writeFile(filename, csv, "utf8");

    console.log(`Export completado: ${filename} (${rows.length} filas)`);
  } catch (err) {
    console.error("Error exportando usuarios:", err);
    process.exit(1);
  }
}

main();
