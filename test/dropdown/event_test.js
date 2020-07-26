import { getEvent, eventMap } from '../../src/module/dropdown/event';

describe('dropdown', () => {
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

        it('执行验证', () => {
            events = getEvent('.test');
            expect(events.open.events).toBe('click');
            expect(events.open.target).toBe('.test');
            expect(events.open.selector).toBe('.gm-dropdown .gm-dropdown-text');

            expect(events.close.events).toBe('click');
            expect(events.close.target).toBe('body');

            expect(events.selected.events).toBe('click');
            expect(events.selected.target).toBe('.test');
            expect(events.selected.selector).toBe('.gm-dropdown .gm-dropdown-list >li');
        });
    });

    describe('eventMap', () => {
        it('基础验证', () => {
            expect(eventMap).toEqual({});
        });
    });
});
