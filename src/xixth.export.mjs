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
	static __dirname = dirname(fileURLToPath(import.meta.url));
	static targetDir = process.env.INIT_CWD || process.cwd();
	/**
	 * @param {string} relativePath
	 * @returns {string}
	 */
	static packagePath = (relativePath) => join(xixth.__dirname, relativePath);
	/**
	 * @param {string} relativePath
	 * @returns {string}
	 */
	static projectPath = (relativePath) => join(xixth.targetDir, relativePath);
	/**
	 * @param {Object} options
	 * @param {{[key:string]:{src:string, dest:string}}} [options.pathCopyHandler]
	 * - export relativePath to project root, works for dirs and files alike;
	 * @param {Object} [options.flagCallbacks]
	 * @param {(flags:FlagEntry)=>Promise<void>} [options.flagCallbacks.beforeCopy]
	 * @param {(flags:FlagEntry)=>Promise<void>} [options.flagCallbacks.afterCopy]
	 */
	constructor(options) {
		/**
		 * @private
		 */
		this.options = options;
		/**
		 * @type {FlagEntry}
		 */
		this.flags = getFlags.flags;
		this.run();
	}
	/**
	 * @private
	 * @param {string} src
	 * @param {string} dest
	 */
	static copyFiles = async (src, dest) => {
		const [_, error] = await tryAsync(async () => {
			await mkdir(dest, { recursive: true });
			const entries = await readdir(src, { withFileTypes: true });
			if (entries.length === 0) {
				console.log(`📁 Created empty directory: ${dest}`);
				return;
			}
			for (const entry of entries) {
				const srcPath = join(src, entry.name);
				const destPath = join(dest, entry.name);
				if (entry.isDirectory()) {
					await this.copyFiles(srcPath, destPath);
				} else {
					await copyFile(srcPath, destPath);
					console.log(`📄 Copied: ${entry.name}`);
				}
			}
		});
		if (error) {
			console.error({ error, src, dest, failed: 'unable to copy `src` to `dest`' });
		}
	};
	/**
	 * @private
	 */
	run = async () => {
		const { pathCopyHandler = false, flagCallbacks = false } = this.options;
		const flags = this.flags;
		const packagePath = xixth.packagePath;
		const projectPath = xixth.projectPath;
		if (flagCallbacks !== false) {
			const { beforeCopy = false } = flagCallbacks;
			if (beforeCopy !== false) {
				await beforeCopy(flags);
			}
		}
		if (pathCopyHandler !== false) {
			for (const key in pathCopyHandler) {
				const file = pathCopyHandler[key];
				let dest = file.dest;
				if (key in flags) {
					dest = flags[key];
				}
				await xixth.copyFiles(packagePath(file.src), projectPath(dest));
			}
		}
		if (flagCallbacks !== false) {
			const { afterCopy = false } = flagCallbacks;
			if (afterCopy !== false) {
				await afterCopy(flags);
			}
		}
	};
}
