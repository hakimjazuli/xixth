// @ts-check

import { copyFile, mkdir, readdir } from 'fs/promises';
import { getFlags } from './getFlags.mjs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { tryAsync } from 'vivth';

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
	 * @param {{[key:string]:{src:string, dest:string}}} [options.pathCopyHandler]
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
		this.generateDirName(options.packageName);
		/**
		 * @type {FlagEntry}
		 */
		this.flags = getFlags.flags;
		this.run();
	}
	/**
	 * @param {string} src
	 * @param {string} dest
	 */
	copyFiles = async (src, dest) => {
		const [_, error] = await tryAsync(async () => {
			await mkdir(dest, { recursive: true });
			const entries = await readdir(src, { withFileTypes: true });
			if (entries.length === 0) {
				return;
			}
			for (const entry of entries) {
				const srcPath = join(src, entry.name);
				const destPath = join(dest, entry.name);
				if (entry.isDirectory()) {
					await this.copyFiles(srcPath, destPath);
				} else {
					await copyFile(srcPath, destPath);
					console.log(`📃 \`xixth\` successfully copy from "${srcPath}" to "${destPath}"`);
				}
			}
		});
		if (error) {
			console.error(`⚠ \`xixth\` unable to copy "${src}" to "${dest}"`);
		}
	};
	/**
	 * @private
	 */
	run = async () => {
		const { pathCopyHandler = false, flagCallbacks = false } = this.options;
		const flags = this.flags;
		const packagePath = this.generatePackageAbsolutePath;
		const projectPath = this.generateProjectAbsolutePath;
		if (flagCallbacks !== false) {
			const { beforeCopy = false } = flagCallbacks;
			if (beforeCopy !== false) {
				await beforeCopy.call(this, flags);
			}
		}
		if (pathCopyHandler !== false) {
			for (const key in pathCopyHandler) {
				const file = pathCopyHandler[key];
				let dest = file.dest;
				if (key in flags) {
					dest = flags[key];
				}
				await this.copyFiles(packagePath(file.src), projectPath(dest));
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
