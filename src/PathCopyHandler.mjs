// @ts-check

/**
 * @typedef {import("./HandleOnCopyHandler.mjs").HandleOnCopyHandlerOptions} HandleOnCopyHandler_
 * @typedef {import("./HandleOnCopyHandler.mjs").HandleOnCopyHandler} HandleOnCopyHandler
 */
/**
 * @typedef {Object} PathCopyHandler
 * @property {HandleOnCopyHandler_["src"]} src
 * - relative source path to `packageRoot`;
 * @property {HandleOnCopyHandler_["dest"]} dest
 * - relative destination path from `projectRoot`;
 * @property {Object} [on]
 * @property {HandleOnCopyHandler} [on.success]
 * @property {HandleOnCopyHandler} [on.failed]
 */
