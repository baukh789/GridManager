import { getEvent, eventMap } from '@module/sort/event';
import { SORT_CLASS, FAKE_TABLE_HEAD_KEY } from '@common/constants';

describe('sort', () => {
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
            expect(events.start.events).toBe('mouseup');
            expect(events.start.target).toBe('#baukh');
            expect(events.start.selector).toBe(`[${FAKE_TABLE_HEAD_KEY}="test"] .${SORT_CLASS}`);
        });
    });

    describe('eventMap', () => {
        it('基础验证', () => {
            expect(eventMap).toEqual({});
        });
    });
});
