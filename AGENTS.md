# Agent Instructions

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get started.

## Project Structure

```
gastown-ui/                          # Town root
├── .beads/                          # Town-level beads (mayor mail, HQ coordination)
├── AGENTS.md                        # This file
├── CLAUDE.md                        # Mayor context
│
└── gastown-ui/                      # Rig: SvelteKit UI project
    ├── .repo.git/                   # Bare git repository (shared by all worktrees)
    │
    ├── mayor/
    │   ├── rig/                     # Mayor's reference clone (READ-ONLY)
    │   │   └── .beads/              # Rig beads database (source of truth)
    │   └── state.json
    │
    ├── polecats/                    # Worker worktrees
    │   ├── furiosa/                 # Polecat worktree
    │   │   └── .beads/redirect      # → ../../mayor/rig/.beads
    │   └── nux/                     # Polecat worktree
    │       └── .beads/redirect      # → ../../mayor/rig/.beads
    │
    ├── refinery/
    │   └── rig/                     # Merge queue processor worktree (on main)
    │       └── .beads/redirect      # → ../../mayor/rig/.beads
    │
    ├── crew/                        # Human-managed worktrees
    │   └── amrit/
    │
    └── witness/                     # Polecat lifecycle monitor
        └── state.json
```

### Key Concepts

| Component | Purpose |
|-----------|---------|
| **Town** | Workspace root containing all rigs |
| **Rig** | Project container (one per repo) |
| **Polecat** | Worker agent with isolated git worktree |
| **Refinery** | Merge queue processor (rebases, tests, merges) |
| **Witness** | Monitors polecat lifecycle |
| **Beads** | Issue tracking, shared via redirect to mayor/rig/.beads |

## Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git
```

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds

