// @ts-check

export class getFlags {
	/**
	 * @typedef {import('../index.mjs').FlagEntry} FlagEntry
	 */
	/**
	 * Parses command-line arguments into a Set<{name, value}>
	 * @returns {FlagEntry}
	 */
	static #parseArgs = () => {
		const args = process.argv.slice(2);
		/**
		 * @type {FlagEntry}
		 */
		const flags = {};
		for (let i = 0; i < args.length; i++) {
			if (args[i].startsWith('-')) {
				const name = args[i].replace(/^-+/, '');
				const value = args[i + 1] && !args[i + 1].startsWith('-') ? args[++i] : '';
				flags[name] = value;
			}
		}
		return flags;
	};
	/**
	 * @type {null|FlagEntry}
	 */
	static #flags_ = null;
	/**
	 * @type {FlagEntry}
	 */
	static get flags() {
		if (getFlags.#flags_ === null) {
			getFlags.#flags_ = getFlags.#parseArgs();
		}
		return getFlags.#flags_;
	}
}
