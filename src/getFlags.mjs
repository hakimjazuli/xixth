// @ts-check

import { argv } from 'node:process';

export class getFlags {
	/**
	 * @typedef {import('./FlagEntry.mjs').FlagEntry} FlagEntry_
	 */
	/**
	 * Parses command-line arguments into a Set<{name, value}>
	 * @returns {FlagEntry_}
	 */
	static #parseArgs = () => {
		const args = argv.slice(2);
		/**
		 * @type {FlagEntry_}
		 */
		const flags = {};
		for (let i = 0; i < args.length; i++) {
			const arg = args[i];
			if (!arg) {
				continue;
			}
			if (arg.startsWith('-')) {
				const name = arg.replace(/^-+/, '');
				const value = args[i + 1] && !args[i + 1]?.startsWith('-') ? args[++i] : '';
				// @ts-expect-error
				flags[name] = value;
			}
		}
		return flags;
	};
	/**
	 * @type {null|FlagEntry_}
	 */
	static #flags_ = null;
	/**
	 * @type {FlagEntry_}
	 */
	static get flags() {
		if (getFlags.#flags_ === null) {
			getFlags.#flags_ = getFlags.#parseArgs();
		}
		return getFlags.#flags_;
	}
}
