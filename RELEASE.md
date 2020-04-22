- Check out the repository and pull the latest updates on MASTER (origin or your fork should work)
- Update the package version in `package.json`.
- Update `CHANGELOG.md` - remember to update the links at the bottom of the document.
- Run `npm install`
- Commit with message `:package: X.X.X` (replacing with version)
- Push commit to master
- Run `npm whoami`, making sure you're logged in properly to NPM. If not, `npm login`.
- If you have GitHub 2FA enabled (you should!), you may need to set an environmental variable with a GitHub [personal access token](https://github.com/settings/tokens) (with "repo access" scope) (`export GH_RELEASE_GITHUB_API_TOKEN="..."`)
- Run `npm run release` (or on Windows, run `scripts/release.sh` from a bash-compatible terminal like Git Bash, Windows Subsystem for Linux, etc) 


After that's all complete, you can do these later at your leisure:

- Delete the [github personal access token](https://github.com/settings/tokens) that you created.
- [Update documentation site](https://github.com/Esri/esri-leaflet-doc#instructions) to use new version
- Optional: Comment on Issues that were resolved, notifying interested parties that the fix was released
- Optional: Post on Geonet, social media, etc
