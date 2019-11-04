import { getEvent, eventMap } from '@module/checkbox/event';

describe('checkbox event', () => {
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
            expect(events.allChange.events).toBe('click');
            expect(events.allChange.target).toBe('#baukh');
            expect(events.allChange.selector).toBe('th[gm-checkbox] .gm-checkbox-wrapper');

            expect(events.checkboxChange.events).toBe('click');
            expect(events.checkboxChange.target).toBe('#baukh');
            expect(events.checkboxChange.selector).toBe('td[gm-checkbox] .gm-checkbox-wrapper');

            expect(events.radioChange.events).toBe('click');
            expect(events.radioChange.target).toBe('#baukh');
            expect(events.radioChange.selector).toBe('td[gm-checkbox] .gm-radio-wrapper');

            expect(events.trChange.events).toBe('click');
            expect(events.trChange.target).toBe('#baukh');
            expect(events.trChange.selector).toBe('tbody > tr');
        });
    });

    describe('eventMap', () => {
        it('基础验证', () => {
            expect(eventMap).toEqual({});
        });
    });
});
