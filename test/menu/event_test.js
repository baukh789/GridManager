import { getEvent, eventMap } from '@module/menu/event';
import { WRAP_KEY, MENU_KEY } from '@common/constants';

describe('menu', () => {
    describe('getEvent', () => {
        let events = null;
        beforeEach(() => {
        });
        afterEach(() => {
            events = null;
        });

        it('基础验证', () => {
            expect(getEvent).toBeDefined();
            expect(getEvent.length).toBe(1);
        });

        it('执行验证', () => {
            events = getEvent('test', '#baukh');
            expect(events.openMenu.events).toBe('contextmenu');
            expect(events.openMenu.target).toBe(`[${WRAP_KEY}="test"]`);

            expect(events.closeMenu.events).toBe('mousedown.closeMenu');
            expect(events.closeMenu.target).toBe('body');

            expect(events.refresh.events).toBe('click');
            expect(events.refresh.target).toBe(`[${MENU_KEY}="test"]`);
            expect(events.refresh.selector).toBe('[menu-action="refresh"]');

            expect(events.exportPage.events).toBe('click');
            expect(events.exportPage.target).toBe(`[${MENU_KEY}="test"]`);
            expect(events.exportPage.selector).toBe('[menu-action="export"]');

            expect(events.printPage.events).toBe('click');
            expect(events.printPage.target).toBe(`[${MENU_KEY}="test"]`);
            expect(events.printPage.selector).toBe('[menu-action="print"]');

            expect(events.openConfig.events).toBe('click');
            expect(events.openConfig.target).toBe(`[${MENU_KEY}="test"]`);
            expect(events.openConfig.selector).toBe('[menu-action="config"]');
        });
    });

    describe('eventMap', () => {
        it('基础验证', () => {
            expect(eventMap).toEqual({});
        });
    });
});
