import getEventFN from '@module/config/event';

describe('getConfigEvent', () => {
    let events = null;
    beforeEach(() => {
    });
    afterEach(() => {
        events = null;
    });

    it('基础验证', () => {
        expect(getEventFN).toBeDefined();
        expect(getEventFN.length).toBe(2);
    });

    it('执行验证', () => {
        events = getEventFN('test', '#baukh');
        expect(events.closeConfig.events).toBe('click');
        expect(events.closeConfig.selector).toBe('#baukh .config-action');

        expect(events.liChange.events).toBe('click');
        expect(events.liChange.selector).toBe('#baukh .config-list li');

        expect(events.closeConfigByBody.events).toBe('mousedown.closeConfig');
        expect(events.closeConfigByBody.selector).toBeUndefined();
    });
});
