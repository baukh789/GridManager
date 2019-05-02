import getEventFN from '@module/core/event';

describe('getCoreEvent', () => {
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
        expect(events.tdMousemove.events).toBe('mousemove');
        expect(events.tdMousemove.selector).toBe('#baukh tbody td');
    });
});
