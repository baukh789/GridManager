import { getEvent, eventMap } from '../../src/module/core/event';

describe('core event', () => {
    describe('getEvent', () => {
        let events = null;
        beforeEach(() => {
        });
        afterEach(() => {
            events = null;
        });

        it('基础验证', () => {
            expect(getEvent).toBeDefined();
            expect(getEvent.length).toBe(1);
        });

        it('rowHover', () => {
            events = getEvent('.test');
            expect(events.rowHover.events).toBe('mousemove');
            expect(events.rowHover.target).toBe('.test');
            expect(events.rowHover.selector).toBe('tr[gm-cache-key]');
        });

        it('rowClick', () => {
            events = getEvent('.test');
            expect(events.rowClick.events).toBe('click');
            expect(events.rowClick.target).toBe('.test');
            expect(events.rowClick.selector).toBe('tr[gm-cache-key]');
        });

        it('cellHover', () => {
            events = getEvent('.test');
            expect(events.cellHover.events).toBe('mousemove');
            expect(events.cellHover.target).toBe('.test');
            expect(events.cellHover.selector).toBe('tr[gm-cache-key] td');
        });

        it('cellClick', () => {
            events = getEvent('.test');
            expect(events.cellClick.events).toBe('click');
            expect(events.cellClick.target).toBe('.test');
            expect(events.cellClick.selector).toBe('tr[gm-cache-key] td');
        });
    });

    describe('eventMap', () => {
        it('基础验证', () => {
            expect(eventMap).toEqual({});
        });
    });
});
