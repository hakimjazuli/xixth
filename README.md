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
>>- you can add your `packageName` on the bin-script-name to avoid global script collision;
```
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
## exported-classes
- [xixth](#xixth)
<h2 id="xixth">xixth</h2>

how to use:- create your `setupFile````js// setupFile.mjs#!/usr/bin/env node// @ts-checkimport { xixth } from 'xixth';new xixth({	pathCopyHandler: {...flagKeys:{src:'path', dest:'path'}}, // optional});```- `pathCopyHandler.flagKeys` are identifier for the user to overwrite its `dest` path with their own `custom path`;- example:```js// setupFile.mjs#!/usr/bin/env node// @ts-checkimport { xixth } from 'xixth';new xixth({	packageName: 'your-package-name',	pathCopyHandler:{devs:{src:'dev', dest:'default_dev'}} // optional});```>- by calling:```shell// using binary with bin object settingnpx your-package-name -devs custom_dev// OR// using postInstall with scripts object settingnpm i your-package-name -devs custom_dev```>- will overwrite user `devs.dest` with `"custom_dev"`;- and you can also handle flags like this:```js// setupFile.mjs#!/usr/bin/env node// @ts-checkimport { xixth } from 'xixth';new xixth({	packageName: 'your-package-name',	pathCopyHandler: {...flagKeys:{src:'path', dest:'path'}}, // optional	flagCallbacks: { // optional		beforeCopy: async ({ ...flagsKeys }) {			// code run before pathCopyHandler		}, // optional		afterCopy: async ({ ...flagsKeys }) {			// code run after pathCopyHandler		}, // optional	},});```>- flagsKeys is destructured flags and its value, make sure to add default value if the flags is not filled;>- as of now `xixth` only support key value pair on flags;

*) <sub>[go to exported list](#exported-classes)</sub>
