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
	 * @param {string} scriptName
	 * - binary script name;
	 * - will be added to `package.json` `bin`;
	 * @param {string} fileName
	 * - file name with extentionName;
	 * - can also be nested inside folder;
	 * @returns {Promise<boolean>}
	 * @example
	 * import { AddBin } from 'xixth';
	 *
	 * (async () => {
	 *  await AddBin.registerReference(
	 * 		'my-script-name',
	 * 		'my-script-name.mjs'
	 * 	);
	 * })()
	 */
	static registerReference = async (scriptName, fileName) => {
		const projectPath = AddBin.#root;
		const jsonPath = join(projectPath, 'package.json');
		const [, errorExist] = await FileSafe.exist(jsonPath);
		if (errorExist && !(await AddBin.#succedToCreatePackageJson(scriptName, fileName, jsonPath))) {
			return false;
		}
		if (!(await AddBin.#succedToEditPackageJson(scriptName, fileName, jsonPath))) {
			return false;
		}
		Console.log(`📃 \`Xixth\` successfully add binary definition to "${jsonPath}"`);
		return true;
	};
	static #binDeclaration = '#!/usr/bin/env node';
	/**
	 * @description
	 * - procedural js bin script registrar and generator for packages;
	 * @param {string} scriptName
	 * - binary script name;
	 * - will be added to `package.json` `bin`;
	 * @param {string} fileName
	 * - file name with extentionName;
	 * - can also be nested inside folder;
	 * @param {string} [overrideXixthStarterCode]
	 * - default: use xixth standard code;
	 * - string: write file with inputed string;
	 * @returns {Promise<boolean>}
	 * @example
	 * import { AddBin } from 'xixth';
	 *
	 * (async () => {
	 *  await AddBin.new(
	 * 		'my-script-name',
	 * 		'my-script-name.mjs',
	 * 		// optional
	 * 	);
	 * })()
	 */
	static new = async (scriptName, fileName, overrideXixthStarterCode = undefined) => {
		await AddBin.registerReference(scriptName, fileName);
		const projectPath = AddBin.#root;
		const binaryFilePath = join(projectPath, fileName);
		const [, error] = await TryAsync(async () => {
			const [, errorExist] = await FileSafe.exist(binaryFilePath);
			if (!errorExist) {
				Console.warn(`📃 \`Xixth\` binary file already exist:"${binaryFilePath}"`);
				return;
			}
			const binDeclaration = this.#binDeclaration;
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
	 * @param {string} binaryScriptName
	 * @param {string} fileName
	 * @param {string} jsonPath
	 * @returns {Promise<boolean>}
	 * - return succed or not
	 */
	static #succedToCreatePackageJson = async (binaryScriptName, fileName, jsonPath) => {
		const [, error] = await TryAsync(async () => {
			return await FileSafe.write(
				jsonPath,
				await format(JSON.stringify({ bin: { [binaryScriptName]: fileName } }), {
					parser: 'json-stringify',
				}),
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
	 * @param {string} binaryScriptName
	 * @param {string} fileName
	 * @param {string} jsonPath
	 * @returns {Promise<boolean>}
	 */
	static #succedToEditPackageJson = async (binaryScriptName, fileName, jsonPath) => {
		const [_, error] = await TryAsync(async () => {
			let bin = {};
			const jsonString = await readFile(jsonPath, { encoding: 'utf8' });
			const json = JSON.parse(jsonString);
			if ('bin' in json) {
				bin = { ...json.bin, [binaryScriptName]: fileName };
			} else {
				bin = { [binaryScriptName]: fileName };
			}
			const newJsonString = await format(JSON.stringify({ ...json, bin }), {
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
