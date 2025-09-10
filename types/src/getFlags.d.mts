export class getFlags {
    /**
     * @typedef {import('../index.mjs').FlagEntry} FlagEntry
     */
    /**
     * Parses command-line arguments into a Set<{name, value}>
     * @returns {FlagEntry}
     */
    static #parseArgs: () => import("./FlagEntry.mjs").FlagEntry;
    /**
     * @type {null|FlagEntry}
     */
    static #flags_: null | import("./FlagEntry.mjs").FlagEntry;
    /**
     * @type {FlagEntry}
     */
    static get flags(): import("./FlagEntry.mjs").FlagEntry;
}
