import getEvent from '@module/dropdown/event';
describe('getEvent', () => {
    let events = null;
    beforeEach(() => {
    });
    afterEach(() => {
        events = null;
    });

    it('基础验证', () => {
        expect(getEvent).toBeDefined();
        expect(getEvent.length).toBe(2);
    });

    it('执行验证', () => {
        events = getEvent('test', '#baukh');
        expect(events.open.events).toBe('click');
        expect(events.open.target).toBe('#baukh');
        expect(events.open.selector).toBe('.gm-dropdown .gm-dropdown-text');

        expect(events.close.events).toBe('click');
        expect(events.close.target).toBe('body');

        expect(events.selected.events).toBe('click');
        expect(events.selected.target).toBe('#baukh');
        expect(events.selected.selector).toBe('.gm-dropdown .gm-dropdown-list >li');
    });
});
