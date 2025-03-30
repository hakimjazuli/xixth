// @ts-check
/**
 * generated using:
 * @see {@link https://www.npmjs.com/package/@html_first/js_lib_template | @html_first/js_lib_template}
 * @copyright
 * this library is made and distributed under MIT license
 * @description
 * ## xixth
 * - are a helper for project starter, mainly to be used as:
 * >- executable through `bin` object which can be called using `npx bin-script-name`;
 * ```json
 * // package.json
 * ...
 * 	"bin": {
 * 		"bin-script-name": "bin.mjs"
 * 	},
 * ...
 * ```
 * >>- you can add your `package-name` on the bin-script-name as best practice to avoid global script collision, like 
 * >>>- 'install-your-package-name', 'starter-your-package-name-starter-name' for project starter, or
 * >>>- 'run-your-packge-name' if the main focus is to run the binary;
 * >- `postInstall` on `scripts` object, which can be called using `npm i package-name`;
 * ```json
 * // package.json
 * 	...
 * 	"script":{
 * 		...
 * 		"postInstall": "node ./setup.mjs",
 * 		...
 * 	},
 * 	...
 * ```
 */
export { xixth } from './src//xixth.export.mjs';
/**
 * @typedef {{[flagName:string]:string}} FlagEntry
 */