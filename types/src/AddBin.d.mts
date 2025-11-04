/**
 * @description
 * - used by xixth-add-bin;
 */
export class AddBin {
    /**
     * @type {string}
     */
    static #root_: string;
    /**
     * @returns {string}
     */
    static get #root(): string;
    /**
     * @description
     * - procedural js bin script registrar for packages;
     * @param {string} scriptName
     * - binary script name;
     * - will be added to `package.json` `bin`;
     * @param {string} fileName
     * - file name with extentionName;
     * - can also be nested inside folder;
     * @param {boolean|string} [scriptsExtension]
     * - default: `false`, does nothing;
     * - `string`: generate reference for `fileName` and `executable` on `package.json` `scripts`;
     * >- direct runing js `scripts.${scriptName}`:`fileName`;
     * >- running binary file `scripts.${scriptName}-${withScripts.value}`: fileName but with `${withScripts}` as extention;
     * >>- extentions should be started with `dot`/`.`;
     * - true: same as `string` input but doesn't generate true compiled binary targets;
     * @returns {Promise<boolean>}
     * @example
     * import { AddBin } from 'xixth';
     *
     * (async () => {
     *  await AddBin.registerReference(
     * 		'my-script-name',
     * 		'my-script-name.mjs',
     * 		// '.exe',
     * 		// false,
     * 		// true, // best for generating
     * 	);
     * })()
     */
    static registerReference: (scriptName: string, fileName: string, scriptsExtension?: boolean | string) => Promise<boolean>;
    static #binDeclaration: string;
    /**
     * @description
     * - procedural js `bin.${scriptName}` script registrar and generator for packages;
     * - also register `scripts.${scriptName}` for testing;
     * @param {string} scriptName
     * - binary script name;
     * - will be added to `package.json` `bin` and `scripts`;
     * @param {string} fileName
     * - file name with extentionName;
     * - can also be nested inside folder;
     * @param {string} [overrideXixthStarterCode]
     * - default: use xixth standard code;
     * - string: write file with inputed string;
     * @returns {Promise<boolean>}
     * @example
     * import { AddBin } from 'xixth';
     *
     * (async () => {
     *  await AddBin.new(
     * 		'my-script-name',
     * 		'my-script-name.mjs',
     * 		// optional file content
     * 	);
     * })()
     */
    static new: (scriptName: string, fileName: string, overrideXixthStarterCode?: string) => Promise<boolean>;
    /**
     * @param {string} binaryScriptName
     * @param {string} fileName
     * @param {string} jsonPath
     * @returns {Promise<boolean>}
     * - return succed or not
     */
    static #succedToCreatePackageJson: (binaryScriptName: string, fileName: string, jsonPath: string) => Promise<boolean>;
    /**
     * @param {string} binaryScriptName
     * @param {string} fileName
     * @param {string} jsonPath
     * @param {boolean|string} [scriptsExtension]
     * @returns {Promise<boolean>}
     */
    static #succedToEditPackageJson: (binaryScriptName: string, fileName: string, jsonPath: string, scriptsExtension?: boolean | string) => Promise<boolean>;
}
