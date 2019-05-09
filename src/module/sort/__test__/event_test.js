import getEventFN from '@module/sort/event';

describe('getSortEvent', () => {
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
        expect(events.sortAction.events).toBe('mouseup');
        expect(events.sortAction.target).toBe('#baukh');
        expect(events.sortAction.selector).toBe('.sorting-action');
    });
});
