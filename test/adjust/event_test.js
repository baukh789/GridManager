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
            expect(events.start.events).toBe('mousedown');
            expect(events.start.target).toBe('#baukh');
            expect(events.start.selector).toBe(`[${FAKE_TABLE_HEAD_KEY}="test"] .${CLASS_ADJUST_ACTION}`);

            expect(events.doing.events).toBe('mousemove');
            expect(events.doing.target).toBe(`[${DIV_KEY}="test"]`);
            expect(events.doing.selector).toBe('#baukh');

            expect(events.abort.events).toBe('mouseup mouseleave');
            expect(events.abort.target).toBe('#baukh');
            expect(events.abort.selector).toBeUndefined();
        });
    });
    describe('eventMap', () => {
        it('基础验证', () => {
            expect(eventMap).toEqual({});
        });
    });
});
