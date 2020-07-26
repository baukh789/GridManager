import { getEvent, eventMap } from '../../src/module/moveRow/event';
import { EMPTY_TPL_KEY } from '../../src/common/constants';

describe('drag', () => {
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
            expect(events.start.events).toBe('mousedown.gmLineDrag');
            expect(events.start.target).toBe('test');
            expect(events.start.selector).toBe(`tr:not([${EMPTY_TPL_KEY}])`);

            expect(events.doing.events).toBe('mousemove.gmLineDrag');
            expect(events.doing.target).toBe('body');
            expect(events.doing.selector).toBeUndefined();

            expect(events.abort.events).toBe('mouseup.gmLineDrag');
            expect(events.abort.target).toBe('body');
            expect(events.abort.selector).toBeUndefined();
        });
    });

    describe('eventMap', () => {
        it('基础验证', () => {
            expect(eventMap).toEqual({});
        });
    });
});
