
import cache from '../src/common/cache';
import { version } from '../package.json';
describe('cache.js', function () {
    it('cache.getVersion()', () => {
        expect(cache.getVersion()).toBe(version);
    });
});
