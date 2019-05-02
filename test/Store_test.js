/**
 * Created by baukh on 17/10/24.
 */
import Store from '@common/Store';
import { version } from '../package.json';

console.info('testing @common/Store');
describe('Store.js', () => {
	it('Store.version', () => {
		expect(Store.version).toBe(version);
	});

	it('Store.scope', () => {
		expect(Store.scope).toBeDefined();
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
