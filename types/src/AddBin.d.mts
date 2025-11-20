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
     * @param {...import('./AddBinRegisterReferenceOptions.mjs').AddBinRegisterReferenceOptions} options
     * @returns {Promise<boolean>}
     * @example
     * import { AddBin } from 'xixth';
     *
     * (async () => {
     *  await AddBin.registerReference({
     * 		binScriptName: 'my-script-name',
     * 		relativeFilePathFromProject: 'my-script-name.mjs',
     * 		// optional
     * 	});
     * })()
     */
    static registerReference: (...options: import("./AddBinRegisterReferenceOptions.mjs").AddBinRegisterReferenceOptions[]) => Promise<boolean>;
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
    static new: (scriptName: string, relativeFilePathFromProject: string, { overrideXixthStarterCode, runtime }?: {
        overrideXixthStarterCode?: string | undefined;
        runtime?: string | undefined;
    }) => Promise<boolean>;
    /**
     * @param {string} baseName
     * @param {string} relativeFilePathFromProject
     * @param {string} jsonPath
     * @param {boolean} registerBin
     * @returns {Promise<boolean>}
     */
    static "__#private@#succeedToCreatePackageJson": (baseName: string, relativeFilePathFromProject: string, jsonPath: string, registerBin: boolean) => Promise<boolean>;
    /**
     * @param {string} baseName
     * @param {string} relativeFilePathFromProject
     * @param {string} jsonPath
     * @param {boolean|string} [stringifiedScript]
     * @param {boolean|string} [stringifiedExec]
     * @returns {Promise<boolean>}
     */
    static "__#private@#succeedToEditPackageJson": (baseName: string, relativeFilePathFromProject: string, jsonPath: string, stringifiedScript?: boolean | string, stringifiedExec?: boolean | string) => Promise<boolean>;
}
