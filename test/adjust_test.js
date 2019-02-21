import adjust from '../src/module/adjust';
/**
 * 验证类的属性及方法总量
 */
describe('adjust 验证类的属性及方法总量', function() {
    let getPropertyCount = null;
    beforeEach(function() {
        getPropertyCount = function(o){
            let n = 0;
            let count = 0;
            for(n in o){
                if(o.hasOwnProperty(n)){
                    count++;
                }
            }
            return count;
        }
    });
    afterEach(function(){
        getPropertyCount = null;
    });
    it('Function count', function() {
        // es6 中 constructor 也会算做为对象的属性, 所以总量上会增加1
        expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(adjust)))).toBe(7 + 1);
    });
});
describe('adjust.html', function() {
    it('基础验证', function(){
        expect(adjust.html).toBeDefined();
        expect(adjust.html).toBe('<span class="adjust-action"></span>');
    });
});

describe('adjust.selectedClassName', function() {
    it('基础验证', function(){
        expect(adjust.selectedClassName).toBeDefined();
        expect(adjust.selectedClassName).toBe('adjust-selected');
    });
});
