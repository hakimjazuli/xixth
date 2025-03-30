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
 *		packageName: 'your-package-name',
 *		pathCopyHandlers:{ // optional
 *			...flagKeys:{
 *				src:'dev', dest:'default_dev',
 *				on:{  // optional if not declared it will be filled with basic console.log upon both condition
 *					success: async () => { // optional if not declared it will be filled with basic console.log
 *						// code
 *					},
 *					failed: async () => { // optional if not declared it will be filled with basic console.error
 *						// code
 *					},
 *				}
 *			}}
 * });
 * ```
 * - `pathCopyHandlers.flagKeys` are identifier for the user to overwrite its `dest` path with their own `custom path`;
 * - example:
 * ```js
 * // setupFile.mjs
 * #!/usr/bin/env node
 * // @ts-check
 * import { xixth } from 'xixth';
 *
 * new xixth({
 *		packageName: 'your-package-name',
 *		pathCopyHandlers: { devs: { src: 'dev', dest: 'default_dev' } }
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
 * 	pathCopyHandlers: {...flagKeys:{src:'path', dest:'path'}}, // optional
 * 	flagCallbacks: { // optional
 * 		async beforeCopy({ ...flagsKeys }) { // optional
 * 			// code run before pathCopyHandlers
 * 		},
 * 		async afterCopy ({ ...flagsKeys }) { // optional
 * 			// code run after pathCopyHandlers
 * 		},
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
     * @param {{[key:string]:{src:string, dest:string, on?:{success?:()=>Promise<void>,failed?:()=>Promise<void>}}}} [options.pathCopyHandlers]
     * - export relativePath to project root, works for dirs and files alike;
     * @param {Object} [options.flagCallbacks]
     * @param {(this:xixth,flags:FlagEntry)=>Promise<void>} [options.flagCallbacks.beforeCopy]
     * @param {(this:xixth,flags:FlagEntry)=>Promise<void>} [options.flagCallbacks.afterCopy]
     */
    constructor(options: {
        packageName: string;
        pathCopyHandlers?: {
            [key: string]: {
                src: string;
                dest: string;
                on?: {
                    success?: () => Promise<void>;
                    failed?: () => Promise<void>;
                };
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
     * @private
     */
    private packageName;
    /**
     * @private
     * @type {FlagEntry}
     */
    private flags;
    /**
     * @param {string} src
     * @param {string} dest
     * @param {{success?:()=>Promise<void>,failed?:()=>Promise<void>}} [on]
     */
    copyFiles: (src: string, dest: string, on?: {
        success?: () => Promise<void>;
        failed?: () => Promise<void>;
    }) => Promise<void>;
    /**
     * @private
     */
    private run;
}
