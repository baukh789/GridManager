import { getEvent, eventMap } from '@module/sort/event';

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
            expect(events.sortAction.events).toBe('mouseup');
            expect(events.sortAction.target).toBe('#baukh');
            expect(events.sortAction.selector).toBe('.sorting-action');
        });
    });

    describe('eventMap', () => {
        it('基础验证', () => {
            expect(eventMap).toEqual({});
        });
    });
});
