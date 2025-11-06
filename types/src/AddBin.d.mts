/**
 * @description
 * - used by xixth-add-bin;
 */
export class AddBin {
    /**
     * @type {string}
     */
    static "__#private@#root_": string;
    /**
     * @returns {string}
     */
    static get "__#private@#root"(): string;
    /**
     * @description
     * - procedural js bin script registrar for packages;
     * @param {string} binScriptName
     * - binary script name;
     * - will be added to `package.json` `bin`;
     * @param {string} absoluteFilePath
     * - file name with extentionName;
     * - can also be nested inside folder;
     * @param {false|string} [stringifiedScript]
     * - default, false: does nothing;
     * - string: add `scripts.${binScriptName}`:`${stringifiedScript}`
     * @param {false|string} [stringifiedExec]
     * - default, false: does nothing;
     * - string: add `scripts.${binScriptName}-exe`:`${stringifiedExec}`
     * @returns {Promise<boolean>}
     * @example
     * import { AddBin } from 'xixth';
     *
     * (async () => {
     *  await AddBin.registerReference(
     * 		'my-script-name',
     * 		'my-script-name.mjs',
     * 		// optional
     * 	);
     * })()
     */
    static registerReference: (binScriptName: string, absoluteFilePath: string, stringifiedScript?: false | string, stringifiedExec?: false | string) => Promise<boolean>;
    /**
     * - auto prefixer for binary def file;
     * @type {'#!/usr/bin/env node'}
     */
    static binDeclaration: "#!/usr/bin/env node";
    /**
     * @description
     * - procedural js `bin.${scriptName}` script registrar and generator for packages;
     * - also register `scripts.${scriptName}` for testing;
     * @param {string} scriptName
     * - binary script name;
     * - will be added to `package.json` `bin` and `scripts`;
     * @param {string} absoluteFilePath
     * - file name with extentionName;
     * - can also be nested inside folder;
     * @param {Object} options
     * @param {string} [options.overrideXixthStarterCode]
     * - default: use xixth standard code;
     * - string: write file with inputed string;
     * @param {string} [options.runtime]
     * - runtime to call the fileName;
     * - default: "node";
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
    static new: (scriptName: string, absoluteFilePath: string, { overrideXixthStarterCode, runtime }: {
        overrideXixthStarterCode?: string | undefined;
        runtime?: string | undefined;
    }) => Promise<boolean>;
    /**
     * @param {string} binaryScriptName
     * @param {string} absoluteFilePath
     * @param {string} jsonPath
     * @returns {Promise<boolean>}
     */
    static "__#private@#succeedToCreatePackageJson": (binaryScriptName: string, absoluteFilePath: string, jsonPath: string) => Promise<boolean>;
    /**
     * @param {string} binaryScriptName
     * @param {string} fileName
     * @param {string} jsonPath
     * @param {boolean|string} [stringifiedScript]
     * @param {boolean|string} [stringifiedExec]
     * @returns {Promise<boolean>}
     */
    static "__#private@#succeedToEditPackageJson": (binaryScriptName: string, fileName: string, jsonPath: string, stringifiedScript?: boolean | string, stringifiedExec?: boolean | string) => Promise<boolean>;
}
