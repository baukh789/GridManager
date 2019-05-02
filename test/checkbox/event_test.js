import getEventFN from '@module/checkbox/event';

describe('getCheckboxEvent', () => {
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
        expect(events.allChange.events).toBe('click');
        expect(events.allChange.selector).toBe('#baukh th[gm-checkbox="true"] input[type="checkbox"]');

        expect(events.checkboxChange.events).toBe('click');
        expect(events.checkboxChange.selector).toBe('#baukh td[gm-checkbox="true"] input[type="checkbox"]');

        expect(events.radioChange.events).toBe('click');
        expect(events.radioChange.selector).toBe('#baukh td[gm-checkbox="true"] input[type="radio"]');

        expect(events.trChange.events).toBe('click');
        expect(events.trChange.selector).toBe('#baukh tbody > tr');
    });
});
