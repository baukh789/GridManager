import { getEvent, eventMap } from '../../src/module/fullColumn/event';
describe('fullColumn event', () => {
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
            events = getEvent('.test', 'full-column-fold');
            expect(events.fold.events).toBe('click');
            expect(events.fold.target).toBe('.test');
            expect(events.fold.selector).toBe('i[full-column-fold]');
        });
    });

    describe('eventMap', () => {
        it('基础验证', () => {
            expect(eventMap).toEqual({});
        });
    });
});
