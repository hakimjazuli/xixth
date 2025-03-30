#!/usr/bin/env node
// @ts-check
import { xixth } from 'xixth';
new xixth({
	packageName: 'xixth',
	pathCopyHandler: { testflag: { src: 'test-copy', dest: 'test-paste' } },
	flagCallbacks: {
		beforeCopy: async () => {
			console.log('beforeCopy');
		},
		afterCopy: async () => {
			console.log('afterCopy');
		},
	},
});
