import { CLASS_FILTER, CLASS_FILTER_SELECTED, CLASS_FILTER_CONTENT } from '@module/filter/constants';
describe('CLASS_FILTER', () => {
    it('CLASS_FILTER', () => {
        expect(CLASS_FILTER).toBe('gm-filter-area');
    });
    it('CLASS_FILTER_SELECTED', () => {
        expect(CLASS_FILTER_SELECTED).toBe('filter-selected');
    });
    it('CLASS_FILTER_CONTENT', () => {
        expect(CLASS_FILTER_CONTENT).toBe('fa-con');
    });
});
