# git-standup

Summarize your recent git commits across all your local repos into a standup-meeting-ready note.

## Install

```bash
npm install -g git-standup
# or run directly from a clone:
node index.js
```

## Usage

```bash
git-standup [--dir ~/projects] [--days 1] [--author "Your Name"] [--format plain|discord]
```

| Flag | Default | Description |
| --- | --- | --- |
| `--dir` | current directory | Root folder to scan for git repos (skips `node_modules`, walks up to 4 levels deep) |
| `--days` | 1 | Look back this many days |
| `--author` | `git config user.name` | Only count your commits |
| `--format` | `plain` | `plain` text or Discord `discord` markdown |

## Example

```
# Standup — 2026-10-02
3 commits across 2 repos

github-digest (2)
  - a1b2c3d add tests
  - e4f5g6h docs

Bot (1)
  - 9x8y7z6 fix queue
```

## License

MIT
