import adjust from '../../src/module/adjust';
import { eventMap } from '../../src/module/adjust/event';
import { CLASS_ADJUST_ACTION } from '../../src/module/adjust/constants';
describe('adjust', () => {
    describe('html', () => {
        it('基础验证', () => {
            expect(adjust.html).toBe(`<span class="${CLASS_ADJUST_ACTION}"></span>`);
        });
    });
    // describe('destroy', () => {
    //     it('基础验证', () => {
    //         expect(eventMap).toEqual({});
    //         eventMap.test = {
    //             a: 1
    //         };
    //         adjust.destroy('test');
    //         expect(eventMap).toEqual({});
    //     });
    // });
});
