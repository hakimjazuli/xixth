// @ts-check

import { copyFile, mkdir, readdir } from 'fs/promises';
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
 * new xixth({ ...flagKeys:{src:'path', dest:'path'} });
 * ```
 * - flagKeys are identifier for the user to overwrite its dest path with their own custom path;
 * - example:
 * ```js
 * // setupFile.mjs
 * #!/usr/bin/env node
 * // @ts-check
 * import { xixth } from 'xixth';
 *
 * new xixth({ devs:{src:'dev', dest:'default_dev'} });
 * ```
 * >- by calling:
 * ```shell
 * // using binary with bin object setting
 * npx your-package-name -devs custom_dev
 * ```
 * >- will overwrite user dest with `"custom_dev"`
 */
export class xixth {
	static __dirname = dirname(fileURLToPath(import.meta.url));
	/**
	 * @param {string} relativePath
	 * @returns {string}
	 */
	static absolutePath = (relativePath) => join(xixth.__dirname, relativePath);
	/**
	 * @param {Object} options
	 * @param {{[key:string]:{src:string, dest:string}}} options.pathCopyHandler
	 * - export relativePath to project root, works for dirs and files alike;
	 */
	constructor(options) {
		/**
		 * @private
		 */
		this.options = options;
		this.run();
	}
	/** @typedef {{ name: string, value: string }} FlagEntry */
	/**
	 * Parses command-line arguments into a Set<{name, value}>
	 * @returns {Set<FlagEntry>}
	 */
	static parseArgs = () => {
		const args = process.argv.slice(2);
		const flags = new Set();
		for (let i = 0; i < args.length; i++) {
			if (args[i].startsWith('-')) {
				const name = args[i].replace(/^-+/, '');
				const value = args[i + 1] && !args[i + 1].startsWith('-') ? args[++i] : '';
				flags.add({ name, value });
			}
		}
		return flags;
	};
	/**
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
			console.error({ error, src, dest });
		}
	};
	run = async () => {
		const flags = xixth.parseArgs();
		const { pathCopyHandler } = this.options;
		const absolutePath = xixth.absolutePath;
		for (const key in pathCopyHandler) {
			const file = pathCopyHandler[key];
			let dest = file.dest;
			if (key in flags) {
				dest = flags[key];
			}
			await xixth.copyFiles(absolutePath(file.src), absolutePath(dest));
		}
	};
}
