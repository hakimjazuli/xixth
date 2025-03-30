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
 * new xixth({
 *		packageName: 'your-package-name',
 *		pathCopyHandler:{devs:{src:'dev', dest:'default_dev'}} // optional
 * });
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
 * 	packageName: 'your-package-name',
 * 	pathCopyHandler: {...flagKeys:{src:'path', dest:'path'}}, // optional
 * 	flagCallbacks: { // optional
 * 		async beforeCopy({ ...flagsKeys }) {
 * 			// code run before pathCopyHandler
 * 		}, // optional
 * 		async afterCopy ({ ...flagsKeys }) {
 * 			// code run after pathCopyHandler
 * 		}, // optional
 * 	},
 * });
 * ```
 * >- flagsKeys is destructured flags and its value, make sure to add default value if the flags is not filled, as of now `xixth` only support key value pair on flags;
 * >- see that `flagCallbacks.beforeCopy` and `flagCallbacks.afterCopy` are `regullar function` and not `arrow function`, since `xixth instance` is bindeded to its `this`, which have methods: `generatePackageAbsolutePath`, `generateProjectAbsolutePath`, and `copyFiles` `public method` for general convenience;
 */
export class xixth {
    /**
     * @param {Object} options
     * @param {string} options.packageName
     * - input with your `packageName`
     * @param {{[key:string]:{src:string, dest:string}}} [options.pathCopyHandler]
     * - export relativePath to project root, works for dirs and files alike;
     * @param {Object} [options.flagCallbacks]
     * @param {(this:xixth,flags:FlagEntry)=>Promise<void>} [options.flagCallbacks.beforeCopy]
     * @param {(this:xixth,flags:FlagEntry)=>Promise<void>} [options.flagCallbacks.afterCopy]
     */
    constructor(options: {
        packageName: string;
        pathCopyHandler?: {
            [key: string]: {
                src: string;
                dest: string;
            };
        };
        flagCallbacks?: {
            beforeCopy?: (this: xixth, flags: import("../index.mjs").FlagEntry) => Promise<void>;
            afterCopy?: (this: xixth, flags: import("../index.mjs").FlagEntry) => Promise<void>;
        };
    });
    /**
     * @typedef {import('../index.mjs').FlagEntry} FlagEntry
     */
    /**
     * @private
     */
    private packageRoot;
    /**
     * @private
     * @param {string} packageName
     * @returns {void}
     */
    private generateDirName;
    /**
     * @private
     */
    private projectRoot;
    /**
     * @param {string} relativePath
     * @returns {string}
     */
    generatePackageAbsolutePath: (relativePath: string) => string;
    /**
     * @param {string} relativePath
     * @returns {string}
     */
    generateProjectAbsolutePath: (relativePath: string) => string;
    /**
     * @private
     * @type {null|xixth}
     */
    private __;
    /**
     * @private
     */
    private options;
    /**
     * @type {FlagEntry}
     */
    flags: import("../index.mjs").FlagEntry;
    /**
     * @param {string} src
     * @param {string} dest
     */
    copyFiles: (src: string, dest: string) => Promise<void>;
    /**
     * @private
     */
    private run;
}
