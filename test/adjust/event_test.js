import getAdjustEvent from '@module/adjust/event';

console.info('testing @module/adjust/event');
describe('getAdjustEvent', () => {
    let events = null;
    beforeEach(() => {
    });
    afterEach(() => {
        events = null;
    });

    it('基础验证', () => {
        expect(getAdjustEvent).toBeDefined();
        expect(getAdjustEvent.length).toBe(2);
    });

    it('执行验证', () => {
        events = getAdjustEvent('test', '#baukh');
        expect(events.adjustStart.events).toBe('mousedown');
        expect(events.adjustStart.selector).toBe('#baukh .adjust-action');

        expect(events.adjusting.events).toBe('mousemove');
        expect(events.adjusting.selector).toBe('#baukh');
    });
});
