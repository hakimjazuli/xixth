#!/usr/bin/env node
// @ts-check

import { writeFile, exists, readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { Xixth } from 'xixth';
import { Console, TryAsync } from 'vivth';

const createCopyInstance = new (class {
	/**
	 * @param {Object} a0
	 * @param {string} a0.n
	 * @param {string} a0.f
	 * @param {string} a0.projectPath
	 * @returns {Promise<void>}
	 */
	create = async ({ n, f, projectPath }) => {
		const jsonPath = join(projectPath, 'package.json');
		const create = await this.isPackageJsonExist(join(projectPath, 'package.json'));
		if (create && !(await this.#createPackageJson(n, f, jsonPath))) {
			return;
		} else if (!(await this.#editPackageJson(n, f, jsonPath))) {
			return;
		}
		Console.log(`📃 \`xixth\` successfully add binary definition to "${jsonPath}"`);
		const binaryFilePath = join(projectPath, f);
		TryAsync(async () => {
			if (await exists(binaryFilePath)) {
				Console.log(`📃 \`xixth\` binary file already exist:"${binaryFilePath}"`);
				return;
			}
			await writeFile(
				binaryFilePath,
				`#!/usr/bin/env node
// @ts-check

import { xixth } from 'xixth';
import { Paths } from 'vivth';
	 
new Paths({
	// root: process?.env?.INIT_CWD ?? process?.cwd(),
});
new xixth({
	// options
})
`,
				{ encoding: 'utf8' }
			);
			Console.log(`📃 \`xixth\` successfully create binary file:"${binaryFilePath}"`);
		}).then(([_, error]) => {
			if (!error) {
				return;
			}
			Console.error(`⚠ \`xixth\` error during creating binary file:"${binaryFilePath}"`);
		});
	};
	/**
	 * @private
	 * @param {string} projectPath
	 * @returns {Promise<boolean>}
	 */
	isPackageJsonExist = async (projectPath) => {
		if (await exists(projectPath)) {
			return false;
		}
		return true;
	};
	/**
	 * @param {string} binaryScriptName
	 * @param {string} fileName
	 * @param {string} jsonPath
	 * @returns {Promise<boolean>}
	 */
	#createPackageJson = async (binaryScriptName, fileName, jsonPath) => {
		const [_, error] = await TryAsync(async () => {
			return await writeFile(jsonPath, JSON.stringify({ bin: { [binaryScriptName]: fileName } }), {
				encoding: 'utf8',
			});
		});
		if (error) {
			Console.error(`⚠ \`xixth\` error during creating file:"${jsonPath}"`);
			return false;
		}
		return true;
	};
	/**
	 * @param {string} binaryScriptName
	 * @param {string} fileName
	 * @param {string} jsonPath
	 * @returns {Promise<boolean>}
	 */
	#editPackageJson = async (binaryScriptName, fileName, jsonPath) => {
		const [_, error] = await TryAsync(async () => {
			let bin = {};
			const jsonString = await readFile(jsonPath, { encoding: 'utf8' });
			const json = JSON.parse(jsonString);
			if ('bin' in json) {
				bin = { ...json.bin, [binaryScriptName]: fileName };
			} else {
				bin = { [binaryScriptName]: fileName };
			}
			const newJsonString = JSON.stringify({ ...json, bin });
			return await writeFile(jsonPath, newJsonString, {
				encoding: 'utf8',
			});
		});
		if (error) {
			Console.error(`⚠ \`xixth\` error during editing file "${jsonPath}"`);
			return false;
		}
		return true;
	};
})();

new Xixth({
	packageName: 'xixth',
	flagCallbacks: {
		async beforeCopy({ n = 'my-package-new-bin', f = 'my-package-new-bin.mjs' }) {
			await createCopyInstance.create({ n, f, projectPath: this.generateProjectAbsolutePath('') });
		},
	},
});
