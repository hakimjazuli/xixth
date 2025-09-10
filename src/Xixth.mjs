// @ts-check

import { copyFile, mkdir, readdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Console, Paths, TryAsync } from 'vivth';

import { getFlags } from './getFlags.mjs';

/**
 * @description
 * how to use:
 * - inside your newly generated `script-file-name-with-ext.mjs`
 * @example
 */
export class Xixth {
	/**
	 * @typedef {import('./FlagEntry.mjs').FlagEntry} FlagEntry
	 */
	/**
	 * @type {string}
	 */
	#packageRoot;
	/**
	 * @param {string} packageName
	 * @returns {void}
	 */
	#generateDirName = (packageName) => {
		if (!this.#packageRoot) {
			const packageEntry = fileURLToPath(import.meta.resolve(packageName));
			this.#packageRoot = dirname(packageEntry.split(`${packageName}/`)[0] + packageName);
		}
	};
	#projectRoot = Paths.root;
	/**
	 * @description
	 * @param {string} relativePath
	 * @returns {string}
	 * @example
	 * ...
	 * // must not be arrow function to accept `this` binding;
	 * async beforeCopy({ ...flagsKeys }) {
	 * 	this.generatePackageAbsolutePath(dest);
	 * },
	 * // must not be arrow function to accept `this` binding;
	 * async afterCopy ({ ...flagsKeys }) {
	 * 	this.generatePackageAbsolutePath(dest);
	 * },
	 * ...
	 */
	generatePackageAbsolutePath = (relativePath) => join(this.#packageRoot, relativePath);
	/**
	 * @description
	 * @param {string} relativePath
	 * @returns {string}
	 * @example
	 * ...
	 * // must not be arrow function to accept `this` binding;
	 * async beforeCopy({ ...flagsKeys }) {
	 * 	this.generateProjectAbsolutePath(dest);
	 * },
	 * // must not be arrow function to accept `this` binding;
	 * async afterCopy ({ ...flagsKeys }) {
	 * 	this.generateProjectAbsolutePath(dest);
	 * },
	 * ...
	 */
	generateProjectAbsolutePath = (relativePath) => join(this.#projectRoot, relativePath);
	/**
	 * @type {Xixth}
	 */
	#instance;
	/**
	 * @description
	 * - create `Xixth` instance;
	 * @param {Object} options
	 * @param {string} options.packageName
	 * - input with your `packageName`
	 * @param {{[key:string]:{src:string, dest:string, on?:{success?:(option:{src:string, dest:string})=>Promise<void>,failed?:(option:{src:string, dest:string})=>Promise<void>}}}} [options.pathCopyHandlers]
	 * - export relativePath to project root, works for dirs and files alike;
	 * @param {Object} [options.flagCallbacks]
	 * @param {(this:Xixth,flags:FlagEntry)=>Promise<void>} [options.flagCallbacks.beforeCopy]
	 * - need to be regullar function instead of arrow function for binding `this`;
	 * @param {(this:Xixth,flags:FlagEntry)=>Promise<void>} [options.flagCallbacks.afterCopy]
	 * - need to be regullar function instead of arrow function for binding `this`;
	 * @example
	 * // script-file-name-with-ext.mjs
	 * #!/usr/bin/env node
	 * import { Xixth } from 'xixth';
	 * import { Paths } from 'vivth';
	 *
	 * new Paths({
	 * 	root: process?.env?.INIT_CWD ?? process?.cwd(),
	 * });
	 * new Xixth({
	 *		packageName: 'your-package-name',
	 *		pathCopyHandlers:{ // optional
	 *			...flagKeys:{
	 *				src:'dev', dest:'default_dev',
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
	 * import { Xixth } from 'xixth';
	 * import { Paths } from 'vivth';
	 *
	 * new Paths({
	 * 	root: process?.env?.INIT_CWD ?? process?.cwd(),
	 * });
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
	 * import { Xixth } from 'xixth';
	 * import { Paths } from 'vivth';
	 *
	 * new Paths({
	 * 	root: process?.env?.INIT_CWD ?? process?.cwd(),
	 * });
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
	constructor(options) {
		if (this.#instance instanceof Xixth) {
			return this.#instance;
		}
		this.#instance = this;
		this.#options = { pathCopyHandlers: false, flagCallbacks: false, ...options };
		this.#packageName = options.packageName;
		this.#generateDirName(options.packageName);

		this.#flags = getFlags.flags;
		this.#run();
	}
	/**
	 * @type {string}
	 */
	#packageName;
	/**
	 * @type {FlagEntry}
	 */
	#flags;
	/**
	 * @property {string} packageName
	 * - input with your `packageName`
	 * @property {{[key:string]:{src:string, dest:string, on?:{success?:(option:{src:string, dest:string})=>Promise<void>,failed?:(option:{src:string, dest:string})=>Promise<void>}}}} pathCopyHandlers
	 * - export relativePath to project root, works for dirs and files alike;
	 * @property {Object} flagCallbacks
	 * @property {(this:Xixth,flags:FlagEntry)=>Promise<void>} flagCallbacks.beforeCopy
	 * @property {(this:Xixth,flags:FlagEntry)=>Promise<void>} flagCallbacks.afterCopy
	 */
	#options;
	/**
	 * @description
	 * - makeDir recursively;
	 * @param {string} dest
	 * @returns {Promise<[void, Error|undefined]>}
	 * @example
	 * ...
	 * // must not be arrow function to accept `this` binding;
	 * async beforeCopy({ ...flagsKeys }) {
	 * 	const [_, error] = await this.makeDir(dest);
	 * },
	 * // must not be arrow function to accept `this` binding;
	 * async afterCopy ({ ...flagsKeys }) {
	 * 	const [_, error] = await this.makeDir(dest);
	 * },
	 * ...
	 */
	makeDir = async (dest) => {
		return await TryAsync(async () => {
			await mkdir(dest, { recursive: true });
		});
	};
	/**
	 * @description
	 * - copy path, dir or file alike, to dest;
	 * @param {string} src
	 * @param {string} dest
	 * @param {{success?:(options:{src:string, dest:string})=>Promise<void>,failed?:(options:{src:string, dest:string})=>Promise<void>}} [on]
	 * @returns {Promise<void>}
	 * @example
	 * ...
	 * // must not be arrow function to accept `this` binding;
	 * async beforeCopy({ ...flagsKeys }) {
	 *  	this.copyPath(src, dest, {
	 * 		...on
	 * 	});
	 * },
	 * // must not be arrow function to accept `this` binding;
	 * async afterCopy ({ ...flagsKeys }) {
	 * 	this.copyPath(src, dest, {
	 * 		...on
	 * 	});
	 * },
	 * ...
	 */
	copyPath = async (src, dest, on = {}) => {
		const packageName = this.#packageName;
		const [_, error] = await TryAsync(async () => {
			const stats = await stat(src);
			if (stats.isFile()) {
				const dir = dirname(dest);
				await mkdir(dir, { recursive: true });
				await copyFile(src, dest);
			} else if (stats.isDirectory()) {
				const [_, error_] = await this.makeDir(dest);
				if (error_) {
					Console.error(`⚠ \`${packageName}\` unable to create dir at "${dest}"`);
					throw error_;
				}
				const entries = await readdir(src, { withFileTypes: true });
				if (entries.length === 0) {
					return;
				}
				for (const entry of entries) {
					const srcPath = join(src, entry.name);
					const destPath = join(dest, entry.name);
					if (entry.isDirectory()) {
						await this.copyPath(srcPath, destPath, on);
					} else {
						await copyFile(srcPath, destPath);
					}
				}
			}
		});
		if (error) {
			if (on && 'failed' in on) {
				await on.failed({ src, dest });
			} else {
				Console.error({
					error,
					message: `⚠ \`${packageName}\` unable to copy from "${src}" to "${dest}"`,
				});
			}
			return;
		}
		if (on && 'success' in on) {
			await on.success({ src, dest });
		} else {
			Console.info(`📃 \`${packageName}\` successfully copy from "${src}" to "${dest}"`);
		}
	};
	#run = async () => {
		const { pathCopyHandlers = false, flagCallbacks = false } = this.#options ?? {};
		const flags = this.#flags;
		const packagePath = this.generatePackageAbsolutePath;
		const projectPath = this.generateProjectAbsolutePath;
		if (flagCallbacks !== false && flagCallbacks !== true) {
			const { beforeCopy = false } = flagCallbacks;
			if (beforeCopy !== false) {
				await beforeCopy.call(this, flags);
			}
		}
		if (pathCopyHandlers !== false && pathCopyHandlers !== true) {
			for (const key in pathCopyHandlers) {
				const file = pathCopyHandlers[key];
				let { dest, src, on = {} } = file;
				if (key in flags) {
					dest = flags[key];
				}
				await this.copyPath(packagePath(src), projectPath(dest), on);
			}
		}
		if (flagCallbacks !== false && flagCallbacks !== true) {
			const { afterCopy = false } = flagCallbacks;
			if (afterCopy !== false) {
				await afterCopy.call(this, flags);
			}
		}
	};
}
