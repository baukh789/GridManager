/**
 * Created by baukh on 17/10/24.
 */
import Store from '@common/Store';
import { version } from '@package.json';

describe('Store.js', () => {
	it('Store.version', () => {
		expect(Store.version).toBe(version);
	});

	it('Store.responseData', () => {
		expect(Store.responseData).toBeDefined();
	});

	it('Store.originalTh', () => {
		expect(Store.checkedData).toBeDefined();
	});

	it('Store.settings', () => {
		expect(Store.settings).toBeDefined();
	});
});
