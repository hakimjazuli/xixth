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
 * // @ts-check
 * import { xixth } from 'xixth';
 * new xixth({ dirs:[...relativeDirPaths], files:[...relativeFilePaths] });
 * ```
 * that's it...
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
	 * @param {{src:string, dest:string}[]|false} [options.dirs]
	 * - export dirs relative to project root
	 * @param {{src:string, dest:string}[]|false} [options.files]
	 * - export files relative to project root
	 */
	constructor(options) {
		/**
		 * @private
		 */
		this.options = options;
		this.run();
	}
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
	run = () => {
		const { dirs = false, files = false } = this.options;
		const absolutePath = xixth.absolutePath;
		if (files !== false) {
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				xixth.copyFiles(absolutePath(file.src), absolutePath(file.dest));
			}
		}
		if (dirs !== false) {
			for (let i = 0; i < dirs.length; i++) {
				const dir = dirs[i];
				xixth.copyFiles(absolutePath(dir.src), absolutePath(dir.dest));
			}
		}
	};
}
