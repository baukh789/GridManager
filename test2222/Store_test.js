/**
 * Created by baukh on 17/10/24.
 */
import Store from '../src/js/Store';
import { version } from '../package.json';
describe('Store.js', function() {
	it('Store.version', function() {
		expect(Store.version).toBe(version);
	});

	it('Store.scope', function() {
		expect(Store.scope).toBeDefined();
	});

	it('Store.responseData', function() {
		expect(Store.responseData).toBeDefined();
	});

	it('Store.originalTh', function() {
		expect(Store.checkedData).toBeDefined();
	});

	it('Store.settings', function() {
		expect(Store.settings).toBeDefined();
	});
});
