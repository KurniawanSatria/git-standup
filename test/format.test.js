import { test } from "node:test";
import assert from "node:assert/strict";
import { formatStandup } from "../src/format.js";

const groups = [
  {
    repo: "Bot",
    commits: [{ hash: "abc1234", subject: "fix queue", date: "2026-10-02" }],
  },
  {
    repo: "gh-digest",
    commits: [
      { hash: "def5678", subject: "add tests", date: "2026-10-02" },
      { hash: "aaa0000", subject: "docs", date: "2026-10-02" },
    ],
  },
];

test("plain format groups commits by repo", () => {
  const out = formatStandup(groups, { days: 1, format: "plain" });
  assert.match(out, /# Standup/);
  assert.match(out, /3 commits across 2 repos/);
  assert.match(out, /gh-digest \(2\)/);
  assert.match(out, /- abc1234 fix queue/);
});

test("discord format bolds repo names", () => {
  const out = formatStandup(groups, { days: 1, format: "discord" });
  assert.match(out, /\*\*Bot\*\* — 1/);
  assert.match(out, /`abc1234` fix queue/);
});

test("empty groups", () => {
  const out = formatStandup([], { days: 3, format: "plain" });
  assert.match(out, /No commits in the last 3 days/);
});
