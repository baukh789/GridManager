import getEventFN from '@module/filter/event';

describe('getFilterEvent', () => {
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
        expect(events.toggle.events).toBe('mousedown');
        expect(events.toggle.selector).toBe('#baukh .fa-icon');

        expect(events.close.events).toBe('mousedown.closeFitler');
        expect(events.close.selector).toBeUndefined();

        expect(events.submit.events).toBe('mouseup');
        expect(events.submit.selector).toBe('#baukh .filter-submit');

        expect(events.reset.events).toBe('mouseup');
        expect(events.reset.selector).toBe('#baukh .filter-reset');

        expect(events.checkboxAction.events).toBe('click');
        expect(events.checkboxAction.selector).toBe('#baukh .gm-checkbox-input');

        expect(events.radioAction.events).toBe('click');
        expect(events.radioAction.selector).toBe('#baukh .gm-radio-input');
    });
});
