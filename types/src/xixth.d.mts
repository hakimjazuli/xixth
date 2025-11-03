/**
 * @description
 * - main class of `xixth`;
 */
export class Xixth {
    /**
     * @typedef {import('./FlagEntry.mjs').FlagEntry} FlagEntry
     * @typedef {import('./PathCopyHandler.mjs').PathCopyHandler} PathCopyHandler
     */
    /**
     * @type {Xixth|undefined}
     */
    static #instance: Xixth | undefined;
    /**
     * @description
     * - create `Xixth` instance;
     * @param {Object} options
     * @param {string} options.packageName
     * - input with your `packageName`
     * @param {{[key:string]: PathCopyHandler }} [options.pathCopyHandlers]
     * - export relativePath to project root, works for dirs and files alike;
     * @param {Object} [options.flagCallbacks]
     * @param {(this:Xixth,flags:FlagEntry)=>Promise<void>} [options.flagCallbacks.beforeCopy]
     * - need to be regullar function instead of arrow function for binding `this`;
     * @param {(this:Xixth,flags:FlagEntry)=>Promise<void>} [options.flagCallbacks.afterCopy]
     * - need to be regullar function instead of arrow function for binding `this`;
     * @example
     * // script-file-name-with-ext.mjs
     * #!/usr/bin/env node
     *
     * import { Xixth } from 'xixth';
     *
     * new Xixth({
     *		packageName: 'your-package-name',
     *		pathCopyHandlers:{ // optional
     *			...flagKeys:{
     *				src:'dev',
     * 				dest:'default_dev',
     *				on:{  // optional if not declared it will be filled with basic Console.log upon both condition
     *					success: async ({src, dest}) => { // optional
     *						// code
     *						// if not declared it will be filled with basic Console.log,
     *						// each file and dir;
     *					},
     *					failed: async ({src, dest}) => { // optional
     *						// code
     *						// if not declared it will be filled with basic Console.error,
     *						// each file and dir
     *					},
     *				}
     *			}}
     * });
     * // `pathCopyHandlers.flagKeys` are identifier for the user to overwrite its `dest` path with their own `custom path`;
     * // script-file-name-with-ext.mjs
     * #!/usr/bin/env node
     *
     * import { Xixth } from 'xixth';
     *
     * new Xixth({
     *		packageName: 'your-package-name',
     *		pathCopyHandlers: { devsflag: { src: 'dev', dest: 'default_dev' } }
     * });
     * // by calling:
     * // npx your-package-name -devsflag custom_dev
     * // will overwrite user `devsflag.dest` with `"custom_dev"`;
     * // - you can also handle flags like with `flagCallbacks`:
     * // script-file-name-with-ext.mjs
     * #!/usr/bin/env node
     *
     * import { Xixth } from 'xixth';
     *
     * new Xixth({
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
     * // either `flagCallbacks` are independent from `pathCopyHandlers`, and still be called(if filled), even if `pathCopyHandlers` is not filled;
     * // `flagCallbacks`'s `flagsKeys` is destructured flags which hold its value, make sure to add default value(incase of if the flags is not filled), as of now `xixth` only support key value pair on flags;
     * // see that `flagCallbacks.beforeCopy` and `flagCallbacks.afterCopy` are `regullar function` and not `arrow function`, since `xixth instance` is bindeded to its `this`, which have methods: `generatePackageAbsolutePath`, `generateProjectAbsolutePath`, `makeDir`, and `copyPath` `public method` for general convenience;
     */
    constructor(options: {
        packageName: string;
        pathCopyHandlers?: {
            [key: string]: import("./PathCopyHandler.mjs").PathCopyHandler;
        } | undefined;
        flagCallbacks?: {
            beforeCopy?: ((this: Xixth, flags: import("./FlagEntry.mjs").FlagEntry) => Promise<void>) | undefined;
            afterCopy?: ((this: Xixth, flags: import("./FlagEntry.mjs").FlagEntry) => Promise<void>) | undefined;
        } | undefined;
    });
    /**
     * @description
     * @param {string} relativePath
     * @returns {string}
     * @example
     * // on flagCallbacks block
     * ...
     * // must be regular function to accept `this` binding;
     * async beforeCopy({ ...flagsKeys }) {
     * 	this.generatePackageAbsolutePath(dest);
     * },
     * // must be regular function to accept `this` binding;
     * async afterCopy ({ ...flagsKeys }) {
     * 	this.generatePackageAbsolutePath(dest);
     * },
     * ...
     */
    generatePackageAbsolutePath: (relativePath: string) => string;
    /**
     * @description
     * @param {string} relativePath
     * @returns {string}
     * @example
     * // on flagCallbacks block
     * ...
     * // must be regular function to accept `this` binding;
     * async beforeCopy({ ...flagsKeys }) {
     * 	this.generateProjectAbsolutePath(dest);
     * },
     * // must be regular function to accept `this` binding;
     * async afterCopy ({ ...flagsKeys }) {
     * 	this.generateProjectAbsolutePath(dest);
     * },
     * ...
     */
    generateProjectAbsolutePath: (relativePath: string) => string;
    /**
     * @description
     * - makeDir recursively;
     * @param {string} dest
     * @returns {ReturnType<typeof TryAsync<void>>}
     * @example
     * ...
     * // must be regular function to accept `this` binding;
     * async beforeCopy({ ...flagsKeys }) {
     * 	const [_, error] = await this.makeDir(dest);
     * },
     * // must be regular function to accept `this` binding;
     * async afterCopy ({ ...flagsKeys }) {
     * 	const [_, error] = await this.makeDir(dest);
     * },
     * ...
     */
    makeDir: (dest: string) => ReturnType<typeof TryAsync<void>>;
    /**
     * @description
     * - copy path, dir or file alike, to dest;
     * @param {string} src
     * @param {string} dest
     * @param {{success?:(options:{src:string, dest:string})=>Promise<void>,failed?:(options:{src:string, dest:string})=>Promise<void>}} [on]
     * @returns {Promise<void>}
     * @example
     * ...
     * // must be regular function to accept `this` binding;
     * async beforeCopy({ ...flagsKeys }) {
     *  	this.copyPath(src, dest, {
     * 		...on
     * 	});
     * },
     * // must be regular function to accept `this` binding;
     * async afterCopy ({ ...flagsKeys }) {
     * 	this.copyPath(src, dest, {
     * 		...on
     * 	});
     * },
     * ...
     */
    copyPath: (src: string, dest: string, on?: {
        success?: (options: {
            src: string;
            dest: string;
        }) => Promise<void>;
        failed?: (options: {
            src: string;
            dest: string;
        }) => Promise<void>;
    }) => Promise<void>;
    #private;
}
import { TryAsync } from 'vivth';
