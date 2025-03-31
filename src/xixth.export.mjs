// @ts-check

import { copyFile, mkdir, readdir } from 'fs/promises';
import { existsSync, statSync } from 'fs';
import { getFlags } from './getFlags.mjs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { tryAsync } from 'vivth';

/**
 * @description
 * how to use:
 * - inside your newly generated `script-file-name-with-ext.mjs`
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
	 * @typedef {import('../index.mjs').FlagEntry} FlagEntry
	 */
	/**
	 * @private
	 */
	packageRoot = null;
	/**
	 * @private
	 * @param {string} packageName
	 * @returns {void}
	 */
	generateDirName = (packageName) => {
		if (this.packageRoot === null) {
			const packageEntry = fileURLToPath(import.meta.resolve(packageName));
			this.packageRoot = dirname(packageEntry.split(`${packageName}/`)[0] + packageName);
		}
	};
	/**
	 * @private
	 */
	projectRoot = process.env.INIT_CWD || process.cwd();
	/**
	 * @param {string} relativePath
	 * @returns {string}
	 */
	generatePackageAbsolutePath = (relativePath) => join(this.packageRoot, relativePath);
	/**
	 * @param {string} relativePath
	 * @returns {string}
	 */
	generateProjectAbsolutePath = (relativePath) => join(this.projectRoot, relativePath);
	/**
	 * @private
	 * @type {null|xixth}
	 */
	__ = null;
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
	constructor(options) {
		if (this.__ instanceof xixth) {
			return this.__;
		}
		this.__ = this;
		/**
		 * @private
		 */
		this.options = options;
		/**
		 * @private
		 */
		this.packageName = options.packageName;
		this.generateDirName(options.packageName);
		/**
		 * @private
		 * @type {FlagEntry}
		 */
		this.flags = getFlags.flags;
		this.run();
	}
	/**
	 * @param {string} dest
	 * @returns {Promise<[void, Error|undefined]>}
	 */
	makeDir = async (dest) => {
		return await tryAsync(async () => {
			if (existsSync(dest)) {
				return;
			}
			await mkdir(dest, { recursive: true });
		});
	};
	/**
	 * @param {string} src
	 * @param {string} dest
	 * @param {{success?:()=>Promise<void>,failed?:()=>Promise<void>}} [on]
	 */
	copyPath = async (src, dest, on) => {
		const packageName = this.packageName;
		const [_, error] = await tryAsync(async () => {
			const stats = statSync(src);
			if (stats.isFile()) {
				await copyFile(src, dest);
			} else if (stats.isDirectory()) {
				const [_, error_] = await this.makeDir(dest);
				if (error_) {
					console.error(`⚠ \`${packageName}\` unable to create dir at "${dest}"`);
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
			if ('failed' in on) {
				await on.failed();
			} else {
				console.error({
					error,
					message: `⚠ \`${packageName}\` unable to copy from "${src}" to "${dest}"`,
				});
			}
			return;
		}
		if ('success' in on) {
			await on.success();
		} else {
			console.log(`📃 \`${packageName}\` successfully copy from "${src}" to "${dest}"`);
		}
	};
	/**
	 * @private
	 */
	run = async () => {
		const { pathCopyHandlers = false, flagCallbacks = false } = this.options;
		const flags = this.flags;
		const packagePath = this.generatePackageAbsolutePath;
		const projectPath = this.generateProjectAbsolutePath;
		if (flagCallbacks !== false) {
			const { beforeCopy = false } = flagCallbacks;
			if (beforeCopy !== false) {
				await beforeCopy.call(this, flags);
			}
		}
		if (pathCopyHandlers !== false) {
			for (const key in pathCopyHandlers) {
				const file = pathCopyHandlers[key];
				let { dest, src, on = {} } = file;
				if (key in flags) {
					dest = flags[key];
				}
				await this.copyPath(packagePath(src), projectPath(dest), on);
			}
		}
		if (flagCallbacks !== false) {
			const { afterCopy = false } = flagCallbacks;
			if (afterCopy !== false) {
				await afterCopy.call(this, flags);
			}
		}
	};
}
