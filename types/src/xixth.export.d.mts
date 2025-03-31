/**
 * @description
 * how to use:
 * - inside your `script-file-name-with-ext.mjs`
 * ```js
 * // script-file-name-with-ext.mjs
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
 * // script-file-name-with-ext.mjs
 * #!/usr/bin/env node
 * // @ts-check
 * import { xixth } from 'xixth';
 *
 * new xixth({
 *		packageName: 'your-package-name',
 *		pathCopyHandlers: { devsflag: { src: 'dev', dest: 'default_dev' } }
 * });
 * ```
 * >- by calling:
 * ```shell
 * npx your-package-name -devsflag custom_dev
 * ```
 * >- will overwrite user `devsflag.dest` with `"custom_dev"`;
 * - you can also handle flags like with `flagCallbacks`:
 * ```js
 * // script-file-name-with-ext.mjs
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
 * >- either `flagCallbacks` are independent from `pathCopyHandlers`, and still be called(if filled), even if `pathCopyHandlers` is not filled;
 * >- `flagCallbacks`'s `flagsKeys` is destructured flags which hold its value, make sure to add default value(incase of if the flags is not filled), as of now `xixth` only support key value pair on flags;
 * >- see that `flagCallbacks.beforeCopy` and `flagCallbacks.afterCopy` are `regullar function` and not `arrow function`, since `xixth instance` is bindeded to its `this`, which have methods: `generatePackageAbsolutePath`, `generateProjectAbsolutePath`, `makeDir`, and `copyPath` `public method` for general convenience;
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
     * @param {string} dest
     * @returns {Promise<[void, Error|undefined]>}
     */
    makeDir: (dest: string) => Promise<[void, Error | undefined]>;
    /**
     * @param {string} src
     * @param {string} dest
     * @param {{success?:()=>Promise<void>,failed?:()=>Promise<void>}} [on]
     */
    copyPath: (src: string, dest: string, on?: {
        success?: () => Promise<void>;
        failed?: () => Promise<void>;
    }) => Promise<void>;
    /**
     * @private
     */
    private run;
}
