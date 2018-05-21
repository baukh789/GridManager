/**
 * Created by baukh on 17/10/24.
 */
import Store from '../src/js/Store';
describe('Store.js', function() {
	it('Store.version', function() {
		expect(Store.version).toBeDefined();
	});

	it('Store.scope', function() {
		expect(Store.scope).toBeDefined();
	});

	it('Store.responseData', function() {
		expect(Store.responseData).toBeDefined();
	});

	it('Store.originalTh', function() {
		expect(Store.originalTh).toBeDefined();
	});

	it('Store.settings', function() {
		expect(Store.settings).toBeDefined();
	});
});
