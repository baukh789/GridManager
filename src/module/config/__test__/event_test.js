import getEventFN from '@module/config/event';
import { CONFIG_KEY } from '@common/constants';

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
        expect(events.closeConfig.target).toBe(`[${CONFIG_KEY}="test"]`);
        expect(events.closeConfig.selector).toBe('.config-action');

        expect(events.liChange.events).toBe('click');
        expect(events.liChange.target).toBe(`[${CONFIG_KEY}="test"]`);
        expect(events.liChange.selector).toBe('.config-list li');

        expect(events.closeConfigByBody.events).toBe('mousedown.closeConfig');
        expect(events.liChange.target).toBe(`[${CONFIG_KEY}="test"]`);
        expect(events.closeConfigByBody.selector).toBeUndefined();
    });
});
