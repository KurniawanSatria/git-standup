#!/usr/bin/env node

import { collectCommits } from "./src/collect.js";
import { formatStandup } from "./src/format.js";

function usage() {
  console.log(`Usage: git-standup [options]

Options:
  --dir <path>    Root directory to scan for git repos (default: current dir)
  --days <n>      Look back this many days (default: 1)
  --author <pat>  Only commits by this author (default: git config user.name)
  --format <fmt>  "plain" or "discord" (default: plain)
  --help          Show this help message
`);
}

function parseArgs(argv) {
  const opts = { dir: process.cwd(), days: 1, author: null, format: "plain" };
  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case "--dir":
        opts.dir = argv[++i];
        break;
      case "--days":
        opts.days = Number(argv[++i]);
        break;
      case "--author":
        opts.author = argv[++i];
        break;
      case "--format":
        opts.format = argv[++i];
        break;
      case "--help":
        usage();
        process.exit(0);
      default:
        console.error(`Unknown option: ${argv[i]}`);
        usage();
        process.exit(1);
    }
  }
  if (!Number.isFinite(opts.days) || opts.days < 1) {
    console.error("--days must be a positive number");
    process.exit(1);
  }
  if (opts.format !== "plain" && opts.format !== "discord") {
    console.error('--format must be "plain" or "discord"');
    process.exit(1);
  }
  return opts;
}

const opts = parseArgs(process.argv.slice(2));

try {
  const groups = await collectCommits(opts);
  console.log(formatStandup(groups, opts));
} catch (err) {
  console.error(`git-standup: ${err.message}`);
  process.exit(1);
}
