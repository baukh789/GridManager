import { getEvent, eventMap } from '../../src/module/drag/event';
import { CLASS_DRAG_ACTION } from '../../src/module/drag/constants';
import { FAKE_TABLE_HEAD_KEY } from '../../src/common/constants';

describe('drag', () => {
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
            expect(events.start.events).toBe('mousedown');
            expect(events.start.target).toBe('#baukh');
            expect(events.start.selector).toBe(`[${FAKE_TABLE_HEAD_KEY}="test"] .${CLASS_DRAG_ACTION}`);

            expect(events.doing.events).toBe('mousemove.gmDrag');
            expect(events.doing.target).toBe('body');
            expect(events.doing.selector).toBeUndefined();

            expect(events.abort.events).toBe('mouseup.gmDrag');
            expect(events.abort.target).toBe('body');
            expect(events.abort.selector).toBeUndefined();
        });
    });

    describe('eventMap', () => {
        it('基础验证', () => {
            expect(eventMap).toEqual({});
        });
    });
});
