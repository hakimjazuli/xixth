// @ts-check

/**
 * @typedef {Object} AddBinRegisterReferenceOptions
 * @property {string} baseName
 * - base name for the script;
 * - will be added to `package.json.bin`;
 * @property {string} relativeFilePathFromProject
 * - file name with extentionName;
 * - can also be nested inside folder;
 * @property {boolean} [registerBin]
 * - default, `true`: register `binScriptName` to `package.json.bin`;
 * - `false`: do nothing;
 * @property {false|string} [stringifiedScript]
 * - default, `false`: does nothing;
 * - `string`: add `scripts.${binScriptName}`:`${stringifiedScript}`
 * @property {false|string} [stringifiedExec]
 * - default, `false`: does nothing;
 * - `string`: add `scripts.${binScriptName}-exe`:`${stringifiedExec}`
 */
