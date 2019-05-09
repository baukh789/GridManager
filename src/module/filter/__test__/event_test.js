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
        expect(events.toggle.target).toBe('#baukh');
        expect(events.toggle.selector).toBe('.filter-area .fa-icon');

        expect(events.close.events).toBe('mousedown.closeFitler');
        expect(events.close.target).toBe('body');
        expect(events.close.selector).toBeUndefined();

        expect(events.submit.events).toBe('mouseup');
        expect(events.submit.target).toBe('#baukh');
        expect(events.submit.selector).toBe('.filter-area .filter-submit');

        expect(events.reset.events).toBe('mouseup');
        expect(events.reset.target).toBe('#baukh');
        expect(events.reset.selector).toBe('.filter-area .filter-reset');

        expect(events.checkboxAction.events).toBe('click');
        expect(events.checkboxAction.target).toBe('#baukh');
        expect(events.checkboxAction.selector).toBe('.filter-area .gm-checkbox-input');

        expect(events.radioAction.events).toBe('click');
        expect(events.radioAction.target).toBe('#baukh');
        expect(events.radioAction.selector).toBe('.filter-area .gm-radio-input');
    });
});
