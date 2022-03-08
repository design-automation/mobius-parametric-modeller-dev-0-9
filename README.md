# mobius-parametric-modeller-dev-0-9
Mobius Modeller version 0.9

## Deployment Instruction:

* Open git bash as admin
* Enter: `git config --system core.longpaths true`
* `npm run deploy`

## Example
Assume that both mobius-sim and mobius-simfuncs have been updated.

To deploy mobius-sim:
- In mobius-sim `package.json`, update the mobius-sim version number.
- In mobus-sim root folder, run `npm run deploy`. This will publish the new version to npm.
- Commit changes to the repo.

To deploy mobius-sim-funcs with the new version of mobius-sim:
- In mobus-sim-funcs root folder, run `npm install @design-automation/mobius-sim@latest`. This will update 
  mobius-sim-funcs to use the latest mobius-sim.
- In mobius-sim-funcs `package.json`, update the mobius-sim-funcs version number.
- In mobus-sim-funcs root, run `npm run deploy`. This will publish the new version to npm.
- Commit changes to the repo.

To deploy mobius (e.g. v0.9.x) with the new version of mobius-sim-funcs:
- In mobius root folder, run `npm install @design-automation/mobius-sim-funcs@latest`. This will update 
  mobius to use the latest mobius-sim-funcs.
- In mobius `package.json`, update the mobius version number.
- In mobius root, run `npm run deploy`. This will publish the new version to GitHub pages.
- Commit changes to the repo.

## Integration with mobius-sim, mobius-sim-funcs and mobius-inline-funcs

When `npm install` is run, mobius-sim, mobius-sim-funcs and mobius-inline-funcs are cloned into `src/design-automation`. When running mobius with `npm start`, the references to these packages will direct to these projects. So, any changes made in those project would be reflected on mobius, allowing for easier code testing. The changes made can also be committed and pushed inside each of the projects

To disable mobius referencing those projects and instead use the npm published version, comment out the paths pointing towards them in `tsconfig.json` and `src/tsconfig.app.json`

