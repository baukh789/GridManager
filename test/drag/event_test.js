import { getEvent, eventMap } from '@module/drag/event';
import { CLASS_DRAG_ACTION } from '@module/drag/constants';
import { FAKE_TABLE_HEAD_KEY } from '@common/constants';

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
            expect(getEvent.length).toBe(2);
        });

        it('执行验证', () => {
            events = getEvent('test', '#baukh');
            expect(events.dragStart.events).toBe('mousedown');
            expect(events.dragStart.target).toBe('#baukh');
            expect(events.dragStart.selector).toBe(`[${FAKE_TABLE_HEAD_KEY}="test"] .${CLASS_DRAG_ACTION}`);

            expect(events.dragging.events).toBe('mousemove.gmDrag');
            expect(events.dragging.target).toBe('body');
            expect(events.dragging.selector).toBeUndefined();

            expect(events.dragAbort.events).toBe('mouseup');
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
