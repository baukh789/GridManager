import { getEvent, eventMap } from '@module/tree/event';
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
            expect(getEvent.length).toBe(3);
        });

        it('执行验证', () => {
            events = getEvent('test', '#baukh', 'tree-element');
            expect(events.toggleState.events).toBe('click');
            expect(events.toggleState.target).toBe('#baukh');
            expect(events.toggleState.selector).toBe('[tree-element] .tree-action');
        });
    });

    describe('eventMap', () => {
        it('基础验证', () => {
            expect(eventMap).toEqual({});
        });
    });
});
