import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readdir } from "node:fs/promises";
import { join, basename } from "node:path";

const execFileAsync = promisify(execFile);

async function git(cwd, args) {
  const { stdout } = await execFileAsync("git", args, { cwd });
  return stdout.trim();
}

async function* walk(dir, depth = 0) {
  if (depth > 4) return;
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  if (entries.some((e) => e.isDirectory() && e.name === ".git")) {
    yield dir;
    return;
  }
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === "node_modules") continue;
    yield* walk(join(dir, entry.name), depth + 1);
  }
}

/**
 * Scan for repos, group commits by repo, most active first.
 * Returns [{ repo, commits: [{ hash, subject, date }] }]
 */
export async function collectCommits({ dir, days, author }) {
  const authorName =
    author ??
    (await git(dir, ["config", "--global", "user.name"]).catch(() => ""));

  const groups = [];
  for await (const repoPath of walk(dir)) {
    const args = [
      "log",
      `--since=${days} days ago`,
      "--pretty=format:%h\x1f%s\x1f%ci",
      "--no-merges",
    ];
    if (authorName) args.push(`--author=${authorName}`);
    let out;
    try {
      out = await git(repoPath, args);
    } catch {
      continue;
    }
    if (!out) continue;
    const commits = out
      .split("\n")
      .map((line) => {
        const [hash, subject, date] = line.split("\x1f");
        return { hash, subject, date };
      })
      .filter((c) => c.hash && c.subject);
    if (commits.length > 0) {
      groups.push({ repo: basename(repoPath), commits });
    }
  }
  groups.sort((a, b) => b.commits.length - a.commits.length);
  return groups;
}
