# Releasing Plannable

## Before the first publish

1. Create the `plannable` package on npm if it is not already claimed.
2. In npm package settings, add this repository's `Publish npm package` GitHub Actions workflow as a trusted publisher.
3. In GitHub, create an `npm` environment and protect it with the reviewers required by the project.
4. Confirm `npm run check` passes on the release commit.

Do not add a long-lived npm token when trusted publishing is available.

## Publish a version

1. Update `package.json` and `package-lock.json` to the intended semantic version.
2. Move the relevant `CHANGELOG.md` entries from `Unreleased` into that version.
3. Run `npm run check`.
4. Create and publish a GitHub release from the reviewed commit.
5. The release workflow reruns the complete quality gate and publishes with npm provenance.
6. Confirm the package contents with `npm view plannable` and test `npx plannable@<version> --version`.

The workflow also supports manual dispatch for recovery, but the normal path is a published GitHub release.
