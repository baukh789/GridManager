import { getEvent, eventMap } from '../../src/module/fixed/event';

describe('fixed', () => {
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
            expect(events.fixedFocus.events).toBe('mousedown');
            expect(events.fixedFocus.target).toBe('#baukh');
            expect(events.fixedFocus.selector).toBe('td[fixed]');
        });
    });

    describe('eventMap', () => {
        it('基础验证', () => {
            expect(eventMap).toEqual({});
        });
    });
});
