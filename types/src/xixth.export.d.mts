/**
 * @description
 * how to use:
 * - create your `setupFile`
 * ```js
 * // setupFile.mjs
 * #!/usr/bin/env node
 * // @ts-check
 * import { xixth } from 'xixth';
 *
 * new xixth({
 * 	pathCopyHandler: {...flagKeys:{src:'path', dest:'path'}}, // optional
 * });
 * ```
 * - `pathCopyHandler.flagKeys` are identifier for the user to overwrite its `dest` path with their own `custom path`;
 * - example:
 * ```js
 * // setupFile.mjs
 * #!/usr/bin/env node
 * // @ts-check
 * import { xixth } from 'xixth';
 *
 * new xixth({ pathCopyHandler:{devs:{src:'dev', dest:'default_dev'}} });
 * ```
 * >- by calling:
 * ```shell
 * // using binary with bin object setting
 * npx your-package-name -devs custom_dev
 * // OR
 * // using postInstall with scripts object setting
 * npm i your-package-name -devs custom_dev
 * ```
 * >- will overwrite user `devs.dest` with `"custom_dev"`;
 * - and you can also handle flags like this:
 * ```js
 * // setupFile.mjs
 * #!/usr/bin/env node
 * // @ts-check
 * import { xixth } from 'xixth';
 *
 * new xixth({
 * 	pathCopyHandler: {...flagKeys:{src:'path', dest:'path'}}, // optional
 * 	flagCallbacks: { // optional
 * 		beforeCopy: async ({ ...flagsKeys }) {
 * 			// code run before pathCopyHandler
 * 		}, // optional
 * 		afterCopy: async ({ ...flagsKeys }) {
 * 			// code run after pathCopyHandler
 * 		}, // optional
 * 	},
 * });
 * ```
 * >- flagsKeys is destructured flags and its value, make sure to add default value if the flags is not filled;
 * >- as of now `xixth` only support key value pair on flags;
 */
export class xixth {
    /**
     * @typedef {import('../index.mjs').FlagEntry} FlagEntry
     */
    static __dirname: string;
    static targetDir: string;
    /**
     * @param {string} relativePath
     * @returns {string}
     */
    static packagePath: (relativePath: string) => string;
    /**
     * @param {string} relativePath
     * @returns {string}
     */
    static projectPath: (relativePath: string) => string;
    /**
     * @private
     * @param {string} src
     * @param {string} dest
     */
    private static copyFiles;
    /**
     * @param {Object} options
     * @param {{[key:string]:{src:string, dest:string}}} [options.pathCopyHandler]
     * - export relativePath to project root, works for dirs and files alike;
     * @param {Object} [options.flagCallbacks]
     * @param {(flags:FlagEntry)=>Promise<void>} [options.flagCallbacks.beforeCopy]
     * @param {(flags:FlagEntry)=>Promise<void>} [options.flagCallbacks.afterCopy]
     */
    constructor(options: {
        pathCopyHandler?: {
            [key: string]: {
                src: string;
                dest: string;
            };
        };
        flagCallbacks?: {
            beforeCopy?: (flags: import("../index.mjs").FlagEntry) => Promise<void>;
            afterCopy?: (flags: import("../index.mjs").FlagEntry) => Promise<void>;
        };
    });
    /**
     * @private
     */
    private options;
    /**
     * @type {FlagEntry}
     */
    flags: import("../index.mjs").FlagEntry;
    /**
     * @private
     */
    private run;
}
