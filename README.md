## xixth<sup>js</sup>

- are a helper for:
  - starter project repository through npm;
  - bin script registration(to `package.json`);

## note

- the example are made using `npm` and `npx`, you can also use other packge manager, however you
  need to stick with single package manager due to binary installation are mainly binded to packager
  manger you use to install the package;
  - impliying you can also uses `bun` and `bunx` and other equivalent;

## installation

- on terminal

```shell
npm i xixth
```

## register binary script to your package

- on terminal:

```shell
npx xixth-add-bin -n your-script-name -f script-file-name-with-ext.mjs
```

- both `-n` and `-f` flags and its value are mandatory;
- best practice of naming `your-script-name` is to add your `package-name` to avoid global script
  name collision;

- edit your newly created `script file`;
  > - use [xixth documentation](#xixth);

## uses

- you can run this binary whether its:

  > - installed through `npm`;
  > - symlinked using `link` package manager `api`;

- which then you can calls it using:

```shell
npx your-script-name
```

<h2 id="list-of-exported-api-and-typehelpers">list of exported API and typehelpers</h2>

- [AddBin](#addbin)
- [AddBinRegisterReferenceOptions](#addbinregisterreferenceoptions)
- [FlagEntry](#flagentry)
- [HandleOnCopyHandler](#handleoncopyhandler)
- [PathCopyHandler](#pathcopyhandler)
- [Xixth](#xixth)

<h2 id="addbin">AddBin</h2>

#### reference:`AddBin`

- used by xixth-add-bin;

#### reference:`AddBin.registerReference`

- procedural js bin script registrar for packages;

```js
/**
 * @param {...import('./AddBinRegisterReferenceOptions.mjs').AddBinRegisterReferenceOptions} options
 * @returns {Promise<boolean>}
 */
```

- <i>example</i>:

```js
import { AddBin } from "xixth";

(async () => {
  await AddBin.registerReference({
    binScriptName: "my-script-name",
    relativeFilePathFromProject: "my-script-name.mjs",
    // optional
  });
})();
```

#### reference:`AddBin.new`

- procedural js `bin.${scriptName}` script registrar and generator for packages;
- also register `scripts.${scriptName}` for testing;

```js
/**
 * @param {string} scriptName
 * - binary script name;
 * - will be added to `package.json` `bin` and `scripts`;
 * @param {string} relativeFilePathFromProject
 * - file name with extentionName;
 * - can also be nested inside folder;
 * @param {Object} [options]
 * @param {string} [options.overrideXixthStarterCode]
 * - default: use xixth standard code;
 * - string: write file with inputed string;
 * @param {string} [options.runtime]
 * - runtime to call the fileName;
 * - default: "node";
 * @returns {Promise<boolean>}
 */
```

- <i>example</i>:

```js
import { AddBin } from "xixth";

(async () => {
  await AddBin.new(
    "my-script-name",
    "my-script-name.mjs",
    // optional file content
  );
})();
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="addbinregisterreferenceoptions">AddBinRegisterReferenceOptions</h2>

- jsdoc types:

```js
/**
 * @typedef {Object} AddBinRegisterReferenceOptions
 * @property {string} baseName
 * - base name for the script;
 * - will be added to `package.json.bin`;
 * @property {string} relativeFilePathFromProject
 * - file name with extentionName;
 * - can also be nested inside folder;
 * @property {boolean} [registerBin]
 * - default, `true`: register `binScriptName` to `package.json.bin`;
 * - `false`: do nothing;
 * @property {false|string} [stringifiedScript]
 * - default, `false`: does nothing;
 * - `string`: add `scripts.${binScriptName}`:`${stringifiedScript}`
 * @property {false|string} [stringifiedExec]
 * - default, `false`: does nothing;
 * - `string`: add `scripts.${binScriptName}-exe`:`${stringifiedExec}`
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="flagentry">FlagEntry</h2>

- jsdoc types:

```js
/**
 * - typehelper for flags;
 * @typedef {{[flagName:string]:string}} FlagEntry
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="handleoncopyhandler">HandleOnCopyHandler</h2>

- jsdoc types:

```js
/**
 * @typedef {Object} HandleOnCopyHandlerOptions
 * @property {string} src
 * - relative source path to `packageRoot`;
 * @property {string} dest
 * - relative destination path from `projectRoot`;
 */
/**
 * @typedef {(options:HandleOnCopyHandlerOptions)=>Promise<void>} HandleOnCopyHandler
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="pathcopyhandler">PathCopyHandler</h2>

- jsdoc types:

```js
/**
 * @typedef {import("./src/HandleOnCopyHandler.mjs").HandleOnCopyHandlerOptions} HandleOnCopyHandler_
 * @typedef {import("./HandleOnCopyHandler.mjs").HandleOnCopyHandler} HandleOnCopyHandler
 */
/**
 * @typedef {Object} PathCopyHandler
 * @property {HandleOnCopyHandler_["src"]} src
 * - relative source path to `packageRoot`;
 * @property {HandleOnCopyHandler_["dest"]} dest
 * - relative destination path from `projectRoot`;
 * @property {Object} [on]
 * @property {HandleOnCopyHandler} [on.success]
 * @property {HandleOnCopyHandler} [on.failed]
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="xixth">Xixth</h2>

#### reference:`Xixth`

- main class of `xixth`;

#### reference:`new Xixth`

- create `Xixth` instance;

```js
/**
 * @param {Object} options
 * @param {string} options.packageName
 * - input with your `packageName`
 * @param {{[key:string]: PathCopyHandler }} [options.pathCopyHandlers]
 * - export relativePath to project root, works for dirs and files alike;
 * @param {Object} [options.flagCallbacks]
 * @param {(this:Xixth,flags:FlagEntry)=>Promise<void>} [options.flagCallbacks.beforeCopy]
 * - need to be regullar function instead of arrow function for binding `this`;
 * @param {(this:Xixth,flags:FlagEntry)=>Promise<void>} [options.flagCallbacks.afterCopy]
 * - need to be regullar function instead of arrow function for binding `this`;
 */
```

- <i>example</i>:

```js
 // script-file-name-with-ext.mjs
 #!/usr/bin/env node

 import { Xixth } from 'xixth';

 new Xixth({
 	packageName: 'your-package-name',
 	pathCopyHandlers:{ // optional
 		...flagKeys:{
 			src:'dev',
 				dest:'default_dev',
 			on:{  // optional if not declared it will be filled with basic Console.log upon both condition
 				success: async ({src, dest}) => { // optional
 					// code
 					// if not declared it will be filled with basic Console.log,
 					// each file and dir;
 				},
 				failed: async ({src, dest}) => { // optional
 					// code
 					// if not declared it will be filled with basic Console.error,
 					// each file and dir
 				},
 			}
 		}}
 });
 // `pathCopyHandlers.flagKeys` are identifier for the user to overwrite its `dest` path with their own `custom path`;
 // script-file-name-with-ext.mjs
 #!/usr/bin/env node

 import { Xixth } from 'xixth';

 new Xixth({
 	packageName: 'your-package-name',
 	pathCopyHandlers: { devsflag: { src: 'dev', dest: 'default_dev' } }
 });
 // by calling:
 // npx your-package-name -devsflag custom_dev
 // will overwrite user `devsflag.dest` with `"custom_dev"`;
 // - you can also handle flags like with `flagCallbacks`:
 // script-file-name-with-ext.mjs
 #!/usr/bin/env node

 import { Xixth } from 'xixth';

 new Xixth({
 	packageName: 'your-package-name',
 	pathCopyHandlers: {...flagKeys:{src:'path', dest:'path'}}, // optional
 	flagCallbacks: { // optional
 		async beforeCopy({ ...flagsKeys }) { // optional
 			// code run before pathCopyHandlers
 		},
 		async afterCopy ({ ...flagsKeys }) { // optional
 			// code run after pathCopyHandlers
 		},
 	},
 });
 // either `flagCallbacks` are independent from `pathCopyHandlers`, and still be called(if filled), even if `pathCopyHandlers` is not filled;
 // `flagCallbacks`'s `flagsKeys` is destructured flags which hold its value, make sure to add default value(incase of if the flags is not filled), as of now `xixth` only support key value pair on flags;
 // see that `flagCallbacks.beforeCopy` and `flagCallbacks.afterCopy` are `regullar function` and not `arrow function`, since `xixth instance` is bindeded to its `this`, which have methods: `generatePackageAbsolutePath`, `generateProjectAbsolutePath`, `makeDir`, and `copyPath` `public method` for general convenience;

```

#### reference:`Xixth_instance.generatePackageAbsolutePath`

```js
/**
 * @param {string} relativePath
 * @returns {string}
 */
```

- <i>example</i>:

```js
 // on flagCallbacks block
 ...
 // must be regular function to accept `this` binding;
 async beforeCopy({ ...flagsKeys }) {
 	this.generatePackageAbsolutePath(dest);
 },
 // must be regular function to accept `this` binding;
 async afterCopy ({ ...flagsKeys }) {
 	this.generatePackageAbsolutePath(dest);
 },
 ...

```

#### reference:`Xixth_instance.generateProjectAbsolutePath`

```js
/**
 * @param {string} relativePath
 * @returns {string}
 */
```

- <i>example</i>:

```js
 // on flagCallbacks block
 ...
 // must be regular function to accept `this` binding;
 async beforeCopy({ ...flagsKeys }) {
 	this.generateProjectAbsolutePath(dest);
 },
 // must be regular function to accept `this` binding;
 async afterCopy ({ ...flagsKeys }) {
 	this.generateProjectAbsolutePath(dest);
 },
 ...

```

#### reference:`Xixth_instance.makeDir`

- makeDir recursively;

```js
/**
 * @param {string} dest
 * @returns {ReturnType<typeof TryAsync<void>>}
 */
```

- <i>example</i>:

```js
 ...
 // must be regular function to accept `this` binding;
 async beforeCopy({ ...flagsKeys }) {
 	const [_, error] = await this.makeDir(dest);
 },
 // must be regular function to accept `this` binding;
 async afterCopy ({ ...flagsKeys }) {
 	const [_, error] = await this.makeDir(dest);
 },
 ...

```

#### reference:`Xixth_instance.copyPath`

- copy path, dir or file alike, to dest;

```js
/**
 * @param {string} src
 * @param {string} dest
 * @param {{success?:(options:{src:string, dest:string})=>Promise<void>,failed?:(options:{src:string, dest:string})=>Promise<void>}} [on]
 * @returns {Promise<void>}
 */
```

- <i>example</i>:

```js
 ...
 // must be regular function to accept `this` binding;
 async beforeCopy({ ...flagsKeys }) {
  	this.copyPath(src, dest, {
 		...on
 	});
 },
 // must be regular function to accept `this` binding;
 async afterCopy ({ ...flagsKeys }) {
 	this.copyPath(src, dest, {
 		...on
 	});
 },
 ...

```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>
