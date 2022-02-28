# mobius-parametric-modeller-dev-0-9
Mobius Modeller version 0.9

## Deployment Instruction:

* Open git bash as admin
* Enter: `git config --system core.longpaths true`
* `npm run deploy`

## Integration with mobius-sim, mobius-sim-funcs and mobius-inline-funcs

When `npm install` is run, mobius-sim, mobius-sim-funcs and mobius-inline-funcs are cloned into `src/design-automation`. When running mobius with `npm start`, the references to these packages will direct to these projects. So, any changes made in those project would be reflected on mobius, allowing for easier code testing. The changes made can also be committed and pushed inside each of the projects

To disable mobius referencing those projects and instead use the npm published version, comment out the paths pointing towards them in `tsconfig.json` and `src/tsconfig.app.json`

