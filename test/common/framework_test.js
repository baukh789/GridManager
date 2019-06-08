import framework from '@common/framework';
describe('Framework', () => {
    let settings = null;
    beforeEach(() => {
        console._log = console.log;
        console.log = jasmine.createSpy('log');
    });

    afterEach(() => {
        settings = null;
        console.log = console._log;
    });
    describe('compileTh', () => {
        it('基础验证', () => {
            expect(framework.compileTh).toBeDefined();
            expect(framework.compileTh.length).toBe(2);
        });
        it('执行验证', () => {
            settings = {
                gridManagerName: 'test'
            };
            expect(framework.compileList.length).toBe(0);
            expect(framework.compileTh(settings, '标题')).toBe('');
            expect(framework.compileList.length).toBe(0);

            settings = {
                gridManagerName: 'test',
                compileVue: jasmine.createSpy('callback')
            };

            expect(framework.compileList.length).toBe(0);
            expect(framework.compileTh(settings, '标题')).toBe('data-compile-id-test=0');
            expect(framework.compileList.length).toBe(1);

        });
    });
});
