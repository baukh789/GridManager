import { getEvent, eventMap } from '../../src/module/ajaxPage/event';
import { TOOLBAR_KEY } from '../../src/common/constants';

describe('ajaxPage event', () => {
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
            events = getEvent('test');
            expect(events.input.events).toBe('keyup');
            expect(events.input.target).toBe(`[${TOOLBAR_KEY}="test"]`);
            expect(events.input.selector).toBe('.gp-input');

            expect(events.first.events).toBe('click');
            expect(events.first.target).toBe(`[${TOOLBAR_KEY}="test"]`);
            expect(events.first.selector).toBe('[pagination-before] .first-page');

            expect(events.previous.events).toBe('click');
            expect(events.previous.target).toBe(`[${TOOLBAR_KEY}="test"]`);
            expect(events.previous.selector).toBe('[pagination-before] .previous-page');

            expect(events.next.events).toBe('click');
            expect(events.next.target).toBe(`[${TOOLBAR_KEY}="test"]`);
            expect(events.next.selector).toBe('[pagination-after] .next-page');

            expect(events.last.events).toBe('click');
            expect(events.last.target).toBe(`[${TOOLBAR_KEY}="test"]`);
            expect(events.last.selector).toBe('[pagination-after] .last-page');

            expect(events.num.events).toBe('click');
            expect(events.num.target).toBe(`[${TOOLBAR_KEY}="test"]`);
            expect(events.num.selector).toBe('[pagination-number] li');

            expect(events.refresh.events).toBe('click');
            expect(events.refresh.target).toBe(`[${TOOLBAR_KEY}="test"]`);
            expect(events.refresh.selector).toBe('.refresh-action');
        });
    });

    describe('eventMap', () => {
        it('基础验证', () => {
            expect(eventMap).toEqual({});
        });
    });
});
