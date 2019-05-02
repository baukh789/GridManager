import getEventFN from '@module/menu/event';

describe('getMenuEvent', () => {
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
        expect(events.openMenu.events).toBe('contextmenu');
        expect(events.openMenu.selector).toBe('.table-wrap[grid-manager-wrap="test"]');

        expect(events.closeMenu.events).toBe('mousedown.closeMenu');
        expect(events.closeMenu.selector).toBeUndefined();

        expect(events.refresh.events).toBe('click');
        expect(events.refresh.selector).toBe('#baukh [grid-action="refresh-page"]');

        expect(events.exportExcel.events).toBe('click');
        expect(events.exportExcel.selector).toBe('#baukh [grid-action="export-excel"]');

        expect(events.openConfig.events).toBe('click');
        expect(events.openConfig.selector).toBe('#baukh [grid-action="config-grid"]');
    });
});
