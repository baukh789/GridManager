import getEventFN from '@module/menu/event';
import { WRAP_KEY, MENU_KEY } from '@common/constants';

describe('getMenuEvent', () => {
    let events = null;
    beforeEach(() => {
    });
    afterEach(() => {
        events = null;
    });

    it('基础验证', () => {
        expect(getEventFN).toBeDefined();
        expect(getEventFN.length).toBe(1);
    });

    it('执行验证', () => {
        events = getEventFN('test', '#baukh');
        expect(events.openMenu.events).toBe('contextmenu');
        expect(events.openMenu.target).toBe(`[${WRAP_KEY}="test"]`);

        expect(events.closeMenu.events).toBe('mousedown.closeMenu');
        expect(events.closeMenu.target).toBe('body');

        expect(events.refresh.events).toBe('click');
        expect(events.refresh.target).toBe(`[${MENU_KEY}="test"]`);
        expect(events.refresh.selector).toBe('[grid-action="refresh-page"]');

        expect(events.exportExcel.events).toBe('click');
        expect(events.exportExcel.target).toBe(`[${MENU_KEY}="test"]`);
        expect(events.exportExcel.selector).toBe('[grid-action="export-excel"]');

        expect(events.openConfig.events).toBe('click');
        expect(events.openConfig.target).toBe(`[${MENU_KEY}="test"]`);
        expect(events.openConfig.selector).toBe('[grid-action="config-grid"]');
    });
});
