/**
 * @description
 * - used by xixth-add-bin;
 */
export class AddBin {
    /**
     * @description
     * - procedural js bin script generator for packages;
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
     *  await AddBin.new('my-script-name', 'my-script-name.mjs');
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
