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

how to use:- inside your newly generated `script-file-name-with-ext.mjs````js// script-file-name-with-ext.mjs#!/usr/bin/env node// @ts-checkimport { xixth } from 'xixth';new xixth({	packageName: 'your-package-name',	pathCopyHandlers:{ // optional		...flagKeys:{			src:'dev', dest:'default_dev',			on:{  // optional if not declared it will be filled with basic console.log upon both condition				success: async ({src, dest}) => { // optional					// code					// if not declared it will be filled with basic console.log,					// each file and dir;				},				failed: async ({src, dest}) => { // optional					// code					// if not declared it will be filled with basic console.error,					// each file and dir				},			}		}}});```- `pathCopyHandlers.flagKeys` are identifier for the user to overwrite its `dest` path with their own `custom path`;- example:```js// script-file-name-with-ext.mjs#!/usr/bin/env node// @ts-checkimport { xixth } from 'xixth';new xixth({	packageName: 'your-package-name',	pathCopyHandlers: { devsflag: { src: 'dev', dest: 'default_dev' } }});```>- by calling:```shellnpx your-package-name -devsflag custom_dev```>- will overwrite user `devsflag.dest` with `"custom_dev"`;- you can also handle flags like with `flagCallbacks`:```js// script-file-name-with-ext.mjs#!/usr/bin/env node// @ts-checkimport { xixth } from 'xixth';new xixth({	packageName: 'your-package-name',	pathCopyHandlers: {...flagKeys:{src:'path', dest:'path'}}, // optional	flagCallbacks: { // optional		async beforeCopy({ ...flagsKeys }) { // optional			// code run before pathCopyHandlers		},		async afterCopy ({ ...flagsKeys }) { // optional			// code run after pathCopyHandlers		},	},});```>- either `flagCallbacks` are independent from `pathCopyHandlers`, and still be called(if filled), even if `pathCopyHandlers` is not filled;>- `flagCallbacks`'s `flagsKeys` is destructured flags which hold its value, make sure to add default value(incase of if the flags is not filled), as of now `xixth` only support key value pair on flags;>- see that `flagCallbacks.beforeCopy` and `flagCallbacks.afterCopy` are `regullar function` and not `arrow function`, since `xixth instance` is bindeded to its `this`, which have methods: `generatePackageAbsolutePath`, `generateProjectAbsolutePath`, `makeDir`, and `copyPath` `public method` for general convenience;

*) <sub>[go to exported list](#exported-classes)</sub>
