import getEventFN from '@module/ajaxPage/event';

console.info('testing @module/ajaxPage/event');
describe('getAjaxEvent', () => {
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
        expect(events.gotoPage.events).toBe('keyup');
        expect(events.gotoPage.selector).toBe('#baukh .gp-input');

        expect(events.firstPage.events).toBe('click');
        expect(events.firstPage.selector).toBe('#baukh [pagination-before] .first-page');

        expect(events.previousPage.events).toBe('click');
        expect(events.previousPage.selector).toBe('#baukh [pagination-before] .previous-page');

        expect(events.nextPage.events).toBe('click');
        expect(events.nextPage.selector).toBe('#baukh [pagination-after] .next-page');

        expect(events.lastPage.events).toBe('click');
        expect(events.lastPage.selector).toBe('#baukh [pagination-after] .last-page');

        expect(events.numberPage.events).toBe('click');
        expect(events.numberPage.selector).toBe('#baukh [pagination-number] li');

        expect(events.refresh.events).toBe('click');
        expect(events.refresh.selector).toBe('#baukh .refresh-action');

        expect(events.changePageSize.events).toBe('change');
        expect(events.changePageSize.selector).toBe('#baukh select[name=pSizeArea]');
    });
});
