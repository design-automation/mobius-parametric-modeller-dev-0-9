# Mobius Modeller Version 0.9 for Developers

Mobius 0.9 consists of three parts:

- [Mobius Modeller 0.9](https://mobius.design-automation.net/)
  - [Mobius SIM Functions](https://github.com/design-automation/mobius-sim-funcs)
    - [Mobius SIM](https://github.com/design-automation/mobius-sim)
  - [Mobius Inline Functions](https://github.com/design-automation/mobius-inline-funcs)

Mobius modeller is deplyed on Github Pages.

The other three parts are libraries published on NPM.

- [Mobius SIM Functions](https://www.npmjs.com/package/@design-automation/mobius-sim-funcs)
- [Mobius SIM](https://www.npmjs.com/package/@design-automation/mobius-sim)
- [Mobius Inline Functions](https://www.npmjs.com/package/@design-automation/mobius-inline-funcs)

## Setup Git

* Open git bash as admin
* Enter: `git config --system core.longpaths true`

## Integration with mobius-sim, mobius-sim-funcs and mobius-inline-funcs

When `npm install` is run, mobius-sim, mobius-sim-funcs and mobius-inline-funcs are cloned into `src/design-automation`. When running mobius with `npm start`, the references to these packages will direct to these projects. 

This is done so that any changes made in those project would be reflected on mobius, allowing for easier code testing. The changes made can also be committed and pushed inside each of the projects

To disable mobius referencing those projects and instead use the npm published version, comment out the paths pointing towards them in `tsconfig.json` and `src/tsconfig.app.json`

## Run Mobius Locally

If you want to run a local copy of Mobius, change to the root folder and `npm install` as usual.

There is an script (see `pull-mobius-sim.sh`) that will pull code from three other repsoitories. 
- mobius-sim
- mobius-sim-funcs
- mobius-inline-funcs

When `npm install` is executed, it will also execute this script. If a popup box opens up asking which program to use to execute this script, select `Git`.

## Updating Mobius on NPM

First, log into the npm account, enter: 
* `npm login`

Assume that both mobius-sim and mobius-simfuncs have been updated.

To deploy mobius-sim:
- In mobius-sim `package.json`, update the mobius-sim version number.
- In mobus-sim root folder, run `npm run deploy`. This will publish the new version to npm.
- Open the mobus-sim root folder in a new vscode, and commit changes to the repo.

To deploy mobius-sim-funcs with the new version of mobius-sim:
- In mobus-sim-funcs root folder, run `npm install @design-automation/mobius-sim@latest`. This will update 
  mobius-sim-funcs to use the latest mobius-sim.
- In mobius-sim-funcs `package.json`, update the mobius-sim-funcs version number.
- In mobus-sim-funcs root, run `npm run deploy`. This will publish the new version to npm.
- Open the mobus-sim-funcs root folder in a new vscdoe, and commit changes to the repo.

To deploy mobius (e.g. v0.9.x) with the new version of mobius-sim-funcs:
- In mobius root folder, run `npm install @design-automation/mobius-sim-funcs@latest`. This will update 
  mobius to use the latest mobius-sim-funcs.
- In mobius `package.json`, update the mobius version number.
- In mobius root, run `npm run deploy`. This will publish the new version to GitHub pages.
- Commit changes to the repo.

## Modifying functions in mobius-sim-funcs and mobius-inline-funcs

If the functions in mobius-sim-funcs or mobius-inline-funcs are modified, the list of functions need to be updated. These lists can be found here:

- `\mobius-parametric-modeller-dev-0-9\src\app\shared\functions\primary-funcs.ts`
- `\mobius-parametric-modeller-dev-0-9\src\app\shared\functions\inline-funcs.ts`

## Updating documentation in mobius-sim-funcs and mobius-inline-funcs

To update the docs, change to the respective folders and run `npm run moduleDocs`.

For mobius-sim-func:
- ...\mobius-parametric-modeller-dev-0-9\src\design-automation\mobius-sim-funcs

For mobius-inline-func:
- ...\mobius-parametric-modeller-dev-0-9\src\design-automation\mobius-inline-funcs

## Commit changes

To commit changes to mobius-sim, mobius-sim-funcs, or mobius-inline-funcs, it is suggested to open the root folder in a new vscode. (You can open a new vscode, and drag thr root folder into it.) Then commit from the new vscode in the usual way.