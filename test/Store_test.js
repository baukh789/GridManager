/**
 * Created by baukh on 17/10/24.
 */
import Store from '../src/js/Store';
describe('Store.js', function() {
	it('Store.responseData', function() {
		expect(Store.version).toBeDefined();
		expect(Store.gridManager).toBeDefined();
		expect(Store.responseData).toBeDefined();
		expect(Store.originalTh).toBeDefined();
		expect(Store.settings).toBeDefined();
	});
});
