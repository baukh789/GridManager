import getEventFN from '@module/drag/event';
import { FAKE_TABLE_HEAD_KEY } from '@common/constants';

describe('getDragEvent', () => {
    let events = null;
    beforeEach(() => {
    });
    afterEach(() => {
        events = null;
    });

    it('基础验证', () => {
        expect(getEventFN).toBeDefined();
        expect(getEventFN.length).toBe(2);
    });

    it('执行验证', () => {
        events = getEventFN('test', '#baukh');
        expect(events.dragStart.events).toBe('mousedown');
        expect(events.dragStart.target).toBe('#baukh');
        expect(events.dragStart.selector).toBe(`[${FAKE_TABLE_HEAD_KEY}="test"] .drag-action`);

        expect(events.dragging.events).toBe('mousemove.gmDrag');
        expect(events.dragging.target).toBe('body');
        expect(events.dragging.selector).toBeUndefined();

        expect(events.dragAbort.events).toBe('mouseup');
        expect(events.dragAbort.target).toBe('body');
        expect(events.dragAbort.selector).toBeUndefined();
    });
});
