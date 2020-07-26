import { ROW_SPAN, MERGE_TD } from '../../src/module/merge/constants';
describe('constants', () => {
    it('ROW_SPAN', () => {
        expect(ROW_SPAN).toBe('rowspan');
    });
    it('MERGE_TD', () => {
        expect(MERGE_TD).toBe('merge-td');
    });
});
