## xixth
- are a helper for project starter, mainly to be used as:
>- executable through `bin` object which can be called using `npx bin-script-name`;
```json
// package.json
...
	"bin": {
		"bin-script-name": "bin.mjs"
	},
...
```
>>- you can add your `package-name` on the bin-script-name as best practice to avoid global script collision, like 
>>>- 'install-your-package-name', 'starter-your-package-name-starter-name' for project starter, or
>>>- 'run-your-packge-name' if the main focus is to run the binary;
>- `postInstall` on `scripts` object, which can be called using `npm i package-name`;
```json
// package.json
	...
	"script":{
		...
		"postInstall": "node ./setup.mjs",
		...
	},
	...
```

## testing
- after installing you can test `xixth` behaviour by calling:
```shell
npx test-xixth
```

## exported-classes
- [xixth](#xixth)
<h2 id="xixth">xixth</h2>

how to use:- create your `setupFile````js// setupFile.mjs#!/usr/bin/env node// @ts-checkimport { xixth } from 'xixth';new xixth({	packageName: 'your-package-name',	pathCopyHandlers:{ // optional		...flagKeys:{			src:'dev', dest:'default_dev',			on:{  // optional if not declared it will be filled with basic console.log upon both condition				success: async () => { // optional if not declared it will be filled with basic console.log					// code				},				failed: async () => { // optional if not declared it will be filled with basic console.error					// code				},			}		}}});```- `pathCopyHandlers.flagKeys` are identifier for the user to overwrite its `dest` path with their own `custom path`;- example:```js// setupFile.mjs#!/usr/bin/env node// @ts-checkimport { xixth } from 'xixth';new xixth({	packageName: 'your-package-name',	pathCopyHandlers: { devs: { src: 'dev', dest: 'default_dev' } }});```>- by calling:```shell// using binary with bin object settingnpx your-package-name -devs custom_dev// OR// using postInstall with scripts object settingnpm i your-package-name -devs custom_dev```>- will overwrite user `devs.dest` with `"custom_dev"`;- and you can also handle flags like this:```js// setupFile.mjs#!/usr/bin/env node// @ts-checkimport { xixth } from 'xixth';new xixth({	packageName: 'your-package-name',	pathCopyHandlers: {...flagKeys:{src:'path', dest:'path'}}, // optional	flagCallbacks: { // optional		async beforeCopy({ ...flagsKeys }) { // optional			// code run before pathCopyHandlers		},		async afterCopy ({ ...flagsKeys }) { // optional			// code run after pathCopyHandlers		},	},});```>- flagsKeys is destructured flags and its value, make sure to add default value if the flags is not filled, as of now `xixth` only support key value pair on flags;>- see that `flagCallbacks.beforeCopy` and `flagCallbacks.afterCopy` are `regullar function` and not `arrow function`, since `xixth instance` is bindeded to its `this`, which have methods: `generatePackageAbsolutePath`, `generateProjectAbsolutePath`, and `copyFiles` `public method` for general convenience;

*) <sub>[go to exported list](#exported-classes)</sub>
