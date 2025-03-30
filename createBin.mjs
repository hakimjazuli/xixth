#!/usr/bin/env node
// @ts-check

import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { xixth } from 'xixth';
import { trySync } from 'vivth';

const createCopyInstance = new (class {
	/**
	 * @param {Object} a0
	 * @param {string} a0.n
	 * @param {string} a0.f
	 * @param {string} a0.projectPath
	 * @returns {void}
	 */
	create({ n, f, projectPath }) {
		const jsonPath = join(projectPath, 'package.json');
		const create = this.isPackageJsonExist(join(projectPath, 'package.json'));
		if (create && !this.createPackageJson(n, f, jsonPath)) {
			return;
		} else if (!this.editPackageJson(n, f, jsonPath)) {
			return;
		}
		console.log(`📃 \`xixth\` successfully add binary definition to "${jsonPath}"`);
		const binaryFilePath = join(projectPath, f);
		const [_, error] = trySync(() => {
			if (existsSync(binaryFilePath)) {
				console.log(`📃 \`xixth\` binary file already exist:"${binaryFilePath}"`);
				return;
			}
			writeFileSync(
				binaryFilePath,
				`#!/usr/bin/env node
// @ts-check

import { xixth } from 'xixth';

new xixth({
	// options
})
`,
				{ encoding: 'utf8' }
			);
			console.log(`📃 \`xixth\` successfully create binary file:"${binaryFilePath}"`);
		});
		if (error) {
			console.error(`⚠ \`xixth\` error during creating binary file:"${binaryFilePath}"`);
			return;
		}
	}
	/**
	 * @private
	 * @param {string} projectPath
	 * @returns {boolean}
	 */
	isPackageJsonExist(projectPath) {
		if (existsSync(projectPath)) {
			return false;
		}
		return true;
	}
	/**
	 * @private
	 * @param {string} binaryScriptName
	 * @param {string} fileName
	 * @param {string} jsonPath
	 * @returns {boolean}
	 */
	createPackageJson(binaryScriptName, fileName, jsonPath) {
		const [_, error] = trySync(() => {
			return writeFileSync(jsonPath, JSON.stringify({ bin: { [binaryScriptName]: fileName } }), {
				encoding: 'utf8',
			});
		});
		if (error) {
			console.error(`⚠ \`xixth\` error during creating file:"${jsonPath}"`);
			return false;
		}
		return true;
	}
	/**
	 * @private
	 * @param {string} binaryScriptName
	 * @param {string} fileName
	 * @param {string} jsonPath
	 * @returns {boolean}
	 */
	editPackageJson(binaryScriptName, fileName, jsonPath) {
		const [_, error] = trySync(() => {
			let bin = {};
			const jsonString = readFileSync(jsonPath, { encoding: 'utf8' });
			const json = JSON.parse(jsonString);
			if ('bin' in json) {
				bin = { ...json.bin, [binaryScriptName]: fileName };
			} else {
				bin = { [binaryScriptName]: fileName };
			}
			const newJsonString = JSON.stringify({ ...json, bin });
			return writeFileSync(jsonPath, newJsonString, {
				encoding: 'utf8',
			});
		});
		if (error) {
			console.error(`⚠ \`xixth\` error during editing file "${jsonPath}"`);
			return false;
		}
		return true;
	}
})();

new xixth({
	packageName: 'xixth',
	flagCallbacks: {
		async beforeCopy({ n = 'my-package-new-bin', f = 'my-package-new-bin.mjs' }) {
			createCopyInstance.create({ n, f, projectPath: this.generateProjectAbsolutePath('') });
		},
	},
});
