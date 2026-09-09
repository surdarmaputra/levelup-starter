# Skills

Project-local agent skills. They encode this repo's conventions so an agent
scaffolds a material the same way twice.

| Skill | What it does |
|---|---|
| `brainstorm` | Generate and pressure-test ideas for new materials — evidence, a verifiable artefact, a cost and go-live check, three disagreeing examples. Runs *before* `add-material`. |
| `add-material` | Scaffold a new learning material: content directories, index page, catalog entry, sidebar wiring |
| `verify-site` | Run the verify loop and interpret its failures |

Add your own alongside them. `.claude/settings.json` also runs
`scripts/bootstrap.sh` on SessionStart, so a fresh agent session has
dependencies and the pre-push hook in place.
