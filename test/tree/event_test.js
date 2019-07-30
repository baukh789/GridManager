import getTreeEvent from '@module/tree/event';
describe('getTreeEvent', () => {
    let events = null;
    beforeEach(() => {
    });
    afterEach(() => {
        events = null;
    });

    it('基础验证', () => {
        expect(getTreeEvent).toBeDefined();
        expect(getTreeEvent.length).toBe(3);
    });

    it('执行验证', () => {
        events = getTreeEvent('test', '#baukh', 'tree-element');
        expect(events.toggleState.events).toBe('click');
        expect(events.toggleState.target).toBe('#baukh');
        expect(events.toggleState.selector).toBe('[tree-element] .tree-action');
    });
});
