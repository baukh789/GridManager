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

        it('rowHover', () => {
            events = getEvent('test', '#baukh');
            expect(events.rowHover.events).toBe('mousemove');
            expect(events.rowHover.target).toBe('#baukh');
            expect(events.rowHover.selector).toBe('tbody tr');
        });

        it('rowClick', () => {
            events = getEvent('test', '#baukh');
            expect(events.rowClick.events).toBe('click');
            expect(events.rowClick.target).toBe('#baukh');
            expect(events.rowClick.selector).toBe('tbody tr');
        });

        it('cellHover', () => {
            events = getEvent('test', '#baukh');
            expect(events.cellHover.events).toBe('mousemove');
            expect(events.cellHover.target).toBe('#baukh');
            expect(events.cellHover.selector).toBe('tbody td');
        });

        it('cellClick', () => {
            events = getEvent('test', '#baukh');
            expect(events.cellClick.events).toBe('click');
            expect(events.cellClick.target).toBe('#baukh');
            expect(events.cellClick.selector).toBe('tbody td');
        });
    });

    describe('eventMap', () => {
        it('基础验证', () => {
            expect(eventMap).toEqual({});
        });
    });
});
