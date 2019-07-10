import getEventFN from '@module/remind/event';

describe('getRemindEvent', () => {
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
        expect(events.remindStart.events).toBe('mouseover');
        expect(events.remindStart.target).toBe('#baukh');
        expect(events.remindStart.selector).toBe('.remind-action');
    });
});
