import { getEvent, eventMap } from '@module/core/event';

describe('core', () => {
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
            expect(events.tdMousemove.events).toBe('mousemove');
            expect(events.tdMousemove.target).toBe('#baukh');
            expect(events.tdMousemove.selector).toBe('tbody td');
        });
    });

    describe('eventMap', () => {
        it('基础验证', () => {
            expect(eventMap).toEqual({});
        });
    });
});
