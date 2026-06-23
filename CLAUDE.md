# action-branching-model

> A GitHub Action that validates PR branch naming against Flagbit's branching model. It runs as a composite action on Node.js 16 and exits non-zero when the source/target branch combination is disallowed.

## Tech Stack

- Runtime: Node.js 16 (no package.json — single vanilla JS file, no dependencies)
- Packaging: GitHub Action (`action.yml` + `index.js`)

## Repository Structure

- `action.yml` — action metadata; declares `node16` runner pointing at `index.js`
- `index.js` — all logic; reads `GITHUB_HEAD_REF` / `GITHUB_BASE_REF` env vars and validates against regex patterns
- `.github/workflows/branching-model.yml` — self-check workflow that runs this action on every PR

## Branching Model Enforced

| Target (base) | Allowed sources (head) |
|---|---|
| `main` | `release/x.y.z`, `hotfix/PROJ-123` |
| `release/x.y.z` | `feature/PROJ-123` |

Branch name patterns:
- `feature/[A-Z0-9]{1,10}-[0-9]{1,4}` (e.g. `feature/IS-841`)
- `hotfix/[A-Z0-9]{1,10}-[0-9]{1,4}`
- `release/\d+\.\d+\.\d+` (e.g. `release/1.2.3`)

PRs targeting `main` or a release branch that don't match the above cause the action to `exit(1)`.

## Usage

Reference the action from any repository's workflow:

```yaml
- uses: flagbit/action-branching-model@<tag>
```

No inputs are required; the action reads the standard GitHub pull-request env vars automatically.

## Conventions

- No build step — `index.js` ships as-is.
- Releases are tagged (e.g. `0.3.0`); consumers pin to a tag.
- Commit style: Conventional Commits (`fix:`, `feat:`, etc.).
