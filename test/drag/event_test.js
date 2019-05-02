import getEventFN from '@module/drag/event';

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
        expect(events.dragStart.selector).toBe('#baukh .drag-action');

        expect(events.dragging.events).toBe('mousemove.gmDrag');
        expect(events.dragging.selector).toBeUndefined();

        expect(events.dragAbort.events).toBe('mouseup');
        expect(events.dragAbort.selector).toBeUndefined();
    });
});
