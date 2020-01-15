import { getEvent, eventMap } from '@module/filter/event';
import { CLASS_FILTER } from '@module/filter/constants';
import { FAKE_TABLE_HEAD_KEY } from '@common/constants';

describe('filter', () => {
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
            const filterSign = `[${FAKE_TABLE_HEAD_KEY}="test"] .${CLASS_FILTER}`;
            expect(events.toggle.events).toBe('mousedown');
            expect(events.toggle.target).toBe('#baukh');
            expect(events.toggle.selector).toBe(`${filterSign} .fa-icon`);

            expect(events.close.events).toBe('mousedown.closeFitler');
            expect(events.close.target).toBe('body');
            expect(events.close.selector).toBeUndefined();

            expect(events.submit.events).toBe('mouseup');
            expect(events.submit.target).toBe('#baukh');
            expect(events.submit.selector).toBe(`${filterSign} .filter-submit`);

            expect(events.reset.events).toBe('mouseup');
            expect(events.reset.target).toBe('#baukh');
            expect(events.reset.selector).toBe(`${filterSign} .filter-reset`);

            expect(events.checkboxAction.events).toBe('click');
            expect(events.checkboxAction.target).toBe('#baukh');
            expect(events.checkboxAction.selector).toBe(`${filterSign} .gm-checkbox-input`);

            expect(events.radioAction.events).toBe('click');
            expect(events.radioAction.target).toBe('#baukh');
            expect(events.radioAction.selector).toBe(`${filterSign} .gm-radio-input`);
        });
    });

    describe('eventMap', () => {
        it('基础验证', () => {
            expect(eventMap).toEqual({});
        });
    });
});
