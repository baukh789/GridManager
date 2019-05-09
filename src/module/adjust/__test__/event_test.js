import getAdjustEvent from '@module/adjust/event';
import { DIV_KEY, FAKE_TABLE_HEAD_KEY } from '@common/constants';
describe('getAdjustEvent', () => {
    let events = null;
    beforeEach(() => {
    });
    afterEach(() => {
        events = null;
    });

    it('基础验证', () => {
        expect(getAdjustEvent).toBeDefined();
        expect(getAdjustEvent.length).toBe(2);
    });

    it('执行验证', () => {
        events = getAdjustEvent('test', '#baukh');
        expect(events.adjustStart.events).toBe('mousedown');
        expect(events.adjustStart.target).toBe('#baukh');
        expect(events.adjustStart.selector).toBe(`[${FAKE_TABLE_HEAD_KEY}="test"] .adjust-action`);

        expect(events.adjusting.events).toBe('mousemove');
        expect(events.adjusting.target).toBe(`[${DIV_KEY}="test"]`);
        expect(events.adjusting.selector).toBe('#baukh');

        expect(events.adjustAbort.events).toBe('mouseup mouseleave');
        expect(events.adjustAbort.target).toBe('#baukh');
        expect(events.adjustAbort.selector).toBeUndefined();
    });
});
