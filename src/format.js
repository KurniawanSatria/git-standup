/**
 * Render the standup summary.
 * groups: [{ repo, commits: [{ hash, subject, date }] }]
 */
export function formatStandup(groups, { days, author, format }) {
  const today = new Date().toISOString().slice(0, 10);
  const total = groups.reduce((n, g) => n + g.commits.length, 0);

  if (total === 0) {
    return `# Standup — ${today}\n\nNo commits in the last ${days} day${days === 1 ? "" : "s"}.`;
  }

  const lines = [];
  lines.push(`# Standup — ${today}`);
  lines.push(
    `${total} commit${total === 1 ? "" : "s"} across ${groups.length} repo${groups.length === 1 ? "" : "s"}` +
      (author ? ` by ${author}` : ""),
  );
  lines.push("");

  for (const group of groups) {
    if (format === "discord") {
      lines.push(`**${group.repo}** — ${group.commits.length}`);
      for (const c of group.commits) {
        lines.push(`  • \`${c.hash}\` ${c.subject}`);
      }
    } else {
      lines.push(`${group.repo} (${group.commits.length})`);
      for (const c of group.commits) {
        lines.push(`  - ${c.hash} ${c.subject}`);
      }
    }
    lines.push("");
  }

  return lines.join("\n").trimEnd() + "\n";
}
