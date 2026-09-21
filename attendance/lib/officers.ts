import "server-only";
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { normalizeAddress } from "@/lib/checkin/address";

/**
 * The officer allowlist, read from a plain text file rather than the database.
 *
 * One officer per line, `#` starts a comment:
 *
 *     0x99d5...2922   admin     Joey
 *     0xabcd...1234   officer   Srijan
 *
 * Role defaults to `officer` when omitted, and anything after the role is a
 * free-text label. Editing the file takes effect on the next sign-in; there is
 * no restart and no migration, which is the whole point of keeping it here.
 */

export type OfficerRole = "officer" | "admin";

export interface Officer {
  address: string; // lowercased
  role: OfficerRole;
  label: string | null;
}

function officersFilePath(): string {
  return process.env.OFFICERS_FILE ?? join(process.cwd(), "officers.txt");
}

export function parseOfficers(contents: string): Officer[] {
  const officers: Officer[] = [];

  for (const rawLine of contents.split("\n")) {
    const line = rawLine.split("#")[0].trim();
    if (!line) continue;

    // Accept whitespace- or comma-separated columns so a copy-pasted list
    // from a spreadsheet works without reformatting.
    const [address, role, ...labelParts] = line.split(/[,\s]+/).filter(Boolean);
    if (!/^0x[0-9a-fA-F]{40}$/.test(address ?? "")) continue;

    officers.push({
      address: address.toLowerCase(),
      role: role?.toLowerCase() === "admin" ? "admin" : "officer",
      label: labelParts.length > 0 ? labelParts.join(" ") : null,
    });
  }

  return officers;
}

// Re-read only when the file actually changes, so a sign-in doesn't hit the
// disk on every request but an edit still lands without a restart.
let cache: { mtimeMs: number; officers: Officer[] } | null = null;

export function loadOfficers(): Officer[] {
  const path = officersFilePath();
  let mtimeMs: number;
  try {
    mtimeMs = statSync(path).mtimeMs;
  } catch {
    // No file means nobody can sign in. That is a louder, safer failure than
    // silently allowing everyone, so it is left as an empty list.
    cache = null;
    return [];
  }

  if (cache && cache.mtimeMs === mtimeMs) return cache.officers;

  const officers = parseOfficers(readFileSync(path, "utf8"));
  cache = { mtimeMs, officers };
  return officers;
}

/** Look up an address in the allowlist file. */
export function findOfficerInFile(address: string): Officer | null {
  const wallet = normalizeAddress(address);
  return loadOfficers().find((o) => o.address === wallet) ?? null;
}
