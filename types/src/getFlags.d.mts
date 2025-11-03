export class getFlags {
    /**
     * @typedef {import('./FlagEntry.mjs').FlagEntry} FlagEntry_
     */
    /**
     * Parses command-line arguments into a Set<{name, value}>
     * @returns {FlagEntry_}
     */
    static #parseArgs: () => import("./FlagEntry.mjs").FlagEntry;
    /**
     * @type {null|FlagEntry_}
     */
    static #flags_: null | import("./FlagEntry.mjs").FlagEntry;
    /**
     * @type {FlagEntry_}
     */
    static get flags(): import("./FlagEntry.mjs").FlagEntry;
}
