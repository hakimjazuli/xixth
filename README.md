## xixth<sup>js</sup>
- are a helper for:
	- starter project repository through npm;
	- binary creation;

## note
- the example are made using `npm` and `npx`, you can also use other packge manager, however you need to stick with single package manager due to binary installation are mainly binded to packager manger you use to install the package;
	- impliying you can also uses `bun` and `bunx` and other equivalent;

## installation
on terminal
```shell
npm i xixth
```

## register binary script to your package
on terminal:
```shell
npx xixth-add-bin -n your-script-name -f script-file-name-with-ext.mjs
```
- both `-n` and `-f` flags and its value are mandatory;
- best practice of naming `your-script-name` is to add your `package-name` to avoid global script name collision;

edit your newly created `script file`;
- use [xixth documentation](#xixth);

## uses
you can run this binary whether its:
- installed through `npm`;
- symlinked using `link` package manager `api`;

which then you can calls it using:
```shell
npx your-script-name
```

## exported-classes
- [xixth](#xixth)
<h2 id="xixth">xixth</h2>

how to use:- create your `setupFile````js// setupFile.mjs#!/usr/bin/env node// @ts-checkimport { xixth } from 'xixth';new xixth({	packageName: 'your-package-name',	pathCopyHandlers:{ // optional		...flagKeys:{			src:'dev', dest:'default_dev',			on:{  // optional if not declared it will be filled with basic console.log upon both condition				success: async () => { // optional if not declared it will be filled with basic console.log					// code				},				failed: async () => { // optional if not declared it will be filled with basic console.error					// code				},			}		}}});```- `pathCopyHandlers.flagKeys` are identifier for the user to overwrite its `dest` path with their own `custom path`;- example:```js// setupFile.mjs#!/usr/bin/env node// @ts-checkimport { xixth } from 'xixth';new xixth({	packageName: 'your-package-name',	pathCopyHandlers: { devs: { src: 'dev', dest: 'default_dev' } }});```>- by calling:```shell// using binary with bin object settingnpx your-package-name -devs custom_dev// OR// using postInstall with scripts object settingnpm i your-package-name -devs custom_dev```>- will overwrite user `devs.dest` with `"custom_dev"`;- and you can also handle flags like this:```js// setupFile.mjs#!/usr/bin/env node// @ts-checkimport { xixth } from 'xixth';new xixth({	packageName: 'your-package-name',	pathCopyHandlers: {...flagKeys:{src:'path', dest:'path'}}, // optional	flagCallbacks: { // optional		async beforeCopy({ ...flagsKeys }) { // optional			// code run before pathCopyHandlers		},		async afterCopy ({ ...flagsKeys }) { // optional			// code run after pathCopyHandlers		},	},});```>- flagsKeys is destructured flags and its value, make sure to add default value if the flags is not filled, as of now `xixth` only support key value pair on flags;>- see that `flagCallbacks.beforeCopy` and `flagCallbacks.afterCopy` are `regullar function` and not `arrow function`, since `xixth instance` is bindeded to its `this`, which have methods: `generatePackageAbsolutePath`, `generateProjectAbsolutePath`, and `copyPath` `public method` for general convenience;

*) <sub>[go to exported list](#exported-classes)</sub>
