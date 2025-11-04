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
     * @returns {Promise<boolean>}
     * @example
     * import { AddBin } from 'xixth';
     *
     * (async () => {
     *  await AddBin.registerReference(
     * 		'my-script-name',
     * 		'my-script-name.mjs'
     * 	);
     * })()
     */
    static registerReference: (scriptName: string, fileName: string) => Promise<boolean>;
    static #binDeclaration: string;
    /**
     * @description
     * - procedural js bin script registrar and generator for packages;
     * @param {string} scriptName
     * - binary script name;
     * - will be added to `package.json` `bin`;
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
     * 		// optional
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
     * @returns {Promise<boolean>}
     */
    static #succedToEditPackageJson: (binaryScriptName: string, fileName: string, jsonPath: string) => Promise<boolean>;
}
