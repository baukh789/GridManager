import { getEvent, eventMap } from '@module/menu/event';
import { WRAP_KEY } from '@common/constants';

describe('menu event', () => {
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
            events = getEvent('test');
            expect(events.openMenu.events).toBe('contextmenu');
            expect(events.openMenu.target).toBe(`[${WRAP_KEY}="test"]`);

            expect(events.closeMenu.events).toBe('mousedown.closeMenu');
            expect(events.closeMenu.target).toBe('body');
        });
    });

    describe('eventMap', () => {
        it('基础验证', () => {
            expect(eventMap).toEqual({});
        });
    });
});
