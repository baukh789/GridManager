import { getEvent, eventMap } from '@module/remind/event';

describe('remind', () => {
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
            expect(events.remindStart.events).toBe('mouseover');
            expect(events.remindStart.target).toBe('#baukh');
            expect(events.remindStart.selector).toBe('.gm-remind-action');
        });
    });

    describe('eventMap', () => {
        it('基础验证', () => {
            expect(eventMap).toEqual({});
        });
    });
});
