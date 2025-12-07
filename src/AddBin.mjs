// @ts-check

import process from 'node:process';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { format } from 'prettier';
import { Console, FileSafe, Paths, TryAsync } from 'vivth';

/**
 * @description
 * - used by xixth-add-bin;
 */
export class AddBin {
	/**
	 * @type {string}
	 */
	static #root_;
	/**
	 * @returns {string}
	 */
	static get #root() {
		if (!AddBin.#root_) {
			new Paths({
				root: process.env.INIT_CWD ?? process.cwd(),
			});
			AddBin.#root_ = Paths.root ?? '';
		}
		return AddBin.#root_;
	}
	/**
	 * @description
	 * - procedural js bin script registrar for packages;
	 * @param {...import('./AddBinRegisterReferenceOptions.mjs').AddBinRegisterReferenceOptions} options
	 * @returns {Promise<boolean>}
	 * @example
	 * import { AddBin } from 'xixth';
	 *
	 * (async () => {
	 *  await AddBin.registerReference({
	 * 		binScriptName: 'my-script-name',
	 * 		relativeFilePathFromProject: 'my-script-name.mjs',
	 * 		// optional
	 * 	});
	 * })()
	 */
	static registerReference = async (...options) => {
		const projectPath = AddBin.#root;
		const jsonPath = join(projectPath, 'package.json');
		const [, errorExist] = await FileSafe.exist(jsonPath);
		for (let i = 0; i < options.length; i++) {
			const option = options[i];
			if (!option) {
				continue;
			}
			const {
				baseName,
				relativeFilePathFromProject,
				registerBin = true,
				stringifiedExec = false,
				stringifiedScript = false,
			} = option;
			if (
				errorExist &&
				!(await AddBin.#succeedToCreatePackageJson(
					baseName,
					relativeFilePathFromProject,
					jsonPath,
					registerBin
				))
			) {
				return false;
			}
			if (
				!(await AddBin.#succeedToEditPackageJson(
					baseName,
					relativeFilePathFromProject,
					jsonPath,
					registerBin,
					stringifiedScript,
					stringifiedExec
				))
			) {
				return false;
			}
			Console.log(`📃 \`Xixth\` successfully add binary definition to "${jsonPath}"`);
		}
		return true;
	};
	/**
	 * - auto prefixer for binary def file;
	 * @type {'#!/usr/bin/env node'}
	 */
	static binDeclaration = '#!/usr/bin/env node';
	/**
	 * @description
	 * - procedural js `bin.${scriptName}` script registrar and generator for packages;
	 * - also register `scripts.${scriptName}` for testing;
	 * @param {string} scriptName
	 * - binary script name;
	 * - will be added to `package.json` `bin` and `scripts`;
	 * @param {string} relativeFilePathFromProject
	 * - file name with extentionName;
	 * - can also be nested inside folder;
	 * @param {Object} [options]
	 * @param {string} [options.overrideXixthStarterCode]
	 * - default: use xixth standard code;
	 * - string: write file with inputed string;
	 * @param {string} [options.runtime]
	 * - runtime to call the fileName;
	 * - default: "node";
	 * @returns {Promise<boolean>}
	 * @example
	 * import { AddBin } from 'xixth';
	 *
	 * (async () => {
	 *  await AddBin.new(
	 * 		'my-script-name',
	 * 		'my-script-name.mjs',
	 * 		// optional file content
	 * 	);
	 * })()
	 */
	static new = async (
		scriptName,
		relativeFilePathFromProject,
		{ overrideXixthStarterCode = undefined, runtime = 'node' } = {}
	) => {
		await AddBin.registerReference({
			baseName: scriptName,
			relativeFilePathFromProject,
			stringifiedScript: `${runtime} ${relativeFilePathFromProject}`,
		});
		const projectPath = AddBin.#root;
		const binaryFilePath = join(projectPath, relativeFilePathFromProject);
		const [, error] = await TryAsync(async () => {
			const [, errorExist] = await FileSafe.exist(binaryFilePath);
			if (!errorExist) {
				Console.warn(`📃 \`Xixth\` binary file already exist:"${binaryFilePath}"`);
				return;
			}
			const binDeclaration = this.binDeclaration;
			const [, errorWrite] = await FileSafe.write(
				binaryFilePath,
				overrideXixthStarterCode
					? `${binDeclaration}
${overrideXixthStarterCode}`
					: `${binDeclaration}
// @ts-check

import { Xixth } from 'xixth';

new Xixth({
  // options
})
`,
				{ encoding: 'utf-8' }
			);
			if (errorWrite) {
				throw errorWrite;
			}
			Console.log(`📃 \`Xixth\` successfully create js binary reference file:"${binaryFilePath}"`);
		});
		if (!error) {
			return true;
		}
		Console.error(
			`⚠ \`Xixth\` error during creating js binary reference file:"${binaryFilePath}"`
		);
		return false;
	};
	/**
	 * @param {string} baseName
	 * @param {string} relativeFilePathFromProject
	 * @param {string} jsonPath
	 * @param {boolean} registerBin
	 * @returns {Promise<boolean>}
	 */
	static #succeedToCreatePackageJson = async (
		baseName,
		relativeFilePathFromProject,
		jsonPath,
		registerBin
	) => {
		const [, error] = await TryAsync(async () => {
			return await FileSafe.write(
				jsonPath,
				await format(
					registerBin ? JSON.stringify({ bin: { [baseName]: relativeFilePathFromProject } }) : '{}',
					{
						parser: 'json-stringify',
					}
				),
				{
					encoding: 'utf8',
				}
			);
		});
		if (error) {
			Console.error(`⚠ \`Xixth\` error during creating file:"${jsonPath}"`);
			return false;
		}
		return true;
	};
	/**
	 * @param {string} baseName
	 * @param {string} relativeFilePathFromProject
	 * @param {string} jsonPath
	 * @param {boolean} registerBin
	 * @param {boolean|string} [stringifiedScript]
	 * @param {boolean|string} [stringifiedExec]
	 * @returns {Promise<boolean>}
	 */
	static #succeedToEditPackageJson = async (
		baseName,
		relativeFilePathFromProject,
		jsonPath,
		registerBin,
		stringifiedScript = false,
		stringifiedExec = false
	) => {
		const [_, error] = await TryAsync(async () => {
			const jsonString = await readFile(jsonPath, { encoding: 'utf8' });
			const json = JSON.parse(jsonString);
			let bin;
			const supposedBin = { [baseName]: relativeFilePathFromProject };
			if ('bin' in json) {
				bin = { ...json.bin, ...supposedBin };
			} else {
				bin = { ...supposedBin };
			}
			const newJSON = { ...json };
			if (registerBin) {
				newJSON.bin = { ...bin };
			}
			if (stringifiedScript) {
				newJSON.scripts = { ...json.scripts, [baseName]: stringifiedScript };
			}
			if (stringifiedExec) {
				newJSON.scripts = { ...json.scripts, [`${baseName}-exe`]: stringifiedExec };
			}
			const newJsonString = await format(JSON.stringify(newJSON), {
				parser: 'json-stringify',
			});
			return await FileSafe.write(jsonPath, newJsonString, {
				encoding: 'utf8',
			});
		});
		if (error) {
			Console.error(`⚠ \`Xixth\` error during editing file "${jsonPath}"`);
			return false;
		}
		return true;
	};
}
