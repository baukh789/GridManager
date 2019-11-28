import { getEvent, eventMap } from '@module/adjust/event';
import { CLASS_ADJUST_ACTION } from '@module/adjust/constants';
import { DIV_KEY, FAKE_TABLE_HEAD_KEY } from '@common/constants';
describe('adjust', () => {
    describe('getEvent', () => {
        let events = null;
        beforeEach(() => {
        });
        afterEach(() => {
            events = null;
        });

        it('基础验证', () => {
            expect(getEvent).toBeDefined();
            expect(getEvent.length).toBe(2);
        });

        it('执行验证', () => {
            events = getEvent('test', '#baukh');
            expect(events.adjustStart.events).toBe('mousedown');
            expect(events.adjustStart.target).toBe('#baukh');
            expect(events.adjustStart.selector).toBe(`[${FAKE_TABLE_HEAD_KEY}="test"] .${CLASS_ADJUST_ACTION}`);

            expect(events.adjusting.events).toBe('mousemove');
            expect(events.adjusting.target).toBe(`[${DIV_KEY}="test"]`);
            expect(events.adjusting.selector).toBe('#baukh');

            expect(events.adjustAbort.events).toBe('mouseup mouseleave');
            expect(events.adjustAbort.target).toBe('#baukh');
            expect(events.adjustAbort.selector).toBeUndefined();
        });
    });
    describe('eventMap', () => {
        it('基础验证', () => {
            expect(eventMap).toEqual({});
        });
    });
});
