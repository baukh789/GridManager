import { getEvent, eventMap } from '../../src/module/tree/event';
describe('tree event', () => {
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
            events = getEvent('.test', 'tree-element');
            expect(events.toggle.events).toBe('click');
            expect(events.toggle.target).toBe('.test');
            expect(events.toggle.selector).toBe('[tree-element] i');
        });
    });

    describe('eventMap', () => {
        it('基础验证', () => {
            expect(eventMap).toEqual({});
        });
    });
});
