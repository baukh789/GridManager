/**
 * Created by baukh on 17/10/24.
 */
import Store from '../src/js/Store';
describe('Store.js', function() {
	it('Store.version', function() {
		expect(Store.version).toBeDefined();
	});

	it('Store.gridManager', function() {
		expect(Store.gridManager).toBeDefined();
	});

	it('Store.gridManager', function() {
		expect(Store.responseData).toBeDefined();
	});

	it('Store.gridManager', function() {
		expect(Store.originalTh).toBeDefined();
	});

	it('Store.gridManager', function() {
		expect(Store.settings).toBeDefined();
	});
});
