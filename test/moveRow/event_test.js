import { getEvent, eventMap } from '@module/moveRow/event';
import { EMPTY_TPL_KEY } from '@common/constants';

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
            expect(events.dragStart.events).toBe('mousedown.gmLineDrag');
            expect(events.dragStart.target).toBe('test');
            expect(events.dragStart.selector).toBe(`tr:not([${EMPTY_TPL_KEY}])`);

            expect(events.dragging.events).toBe('mousemove.gmLineDrag');
            expect(events.dragging.target).toBe('body');
            expect(events.dragging.selector).toBeUndefined();

            expect(events.dragAbort.events).toBe('mouseup.gmLineDrag');
            expect(events.dragAbort.target).toBe('body');
            expect(events.dragAbort.selector).toBeUndefined();
        });
    });

    describe('eventMap', () => {
        it('基础验证', () => {
            expect(eventMap).toEqual({});
        });
    });
});
