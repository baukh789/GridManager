import framework from '@common/framework';
describe('Framework', () => {
    let settings = null;
    let compileList = null;
    beforeEach(() => {
        console._log = console.log;
        console.log = jasmine.createSpy('log');
    });

    afterEach(() => {
        settings = null;
        compileList = null;
        console.log = console._log;
    });
    describe('compileTh', () => {
        it('基础验证', () => {
            expect(framework.compileTh).toBeDefined();
            expect(framework.compileTh.length).toBe(2);
        });
        it('执行验证', () => {
            settings = {
                compileVue: jasmine.createSpy('callback')
            };

            expect(framework.compileList.length).toBe(0);
            expect(framework.compileTh(settings, '标题')).toBe('');
            expect(framework.compileList.length).toBe(0);

            expect(framework.compileTh(settings, '标题')).toBe('');
        });
    });

    it('vue 单个解析', () => {
        settings = {
            compileVue: jasmine.createSpy('callback')
        };
        compileList = document.createElement('div');
        base.compileFramework(settings, compileList);
        expect(settings.compileVue).toHaveBeenCalled();
    });

    it('vue 数组解析', () => {
        settings = {
            compileVue: jasmine.createSpy('callback')
        };
        compileList = [];
        compileList.push(document.createElement('div'));
        compileList.push(document.createElement('div'));
        compileList.push(document.createElement('div'));
        base.compileFramework(settings, compileList);
        expect(settings.compileVue).toHaveBeenCalled();
    });

    it('angular 单个解析', () => {
        settings = {
            compileAngularjs: jasmine.createSpy('callback')
        };
        compileList = document.querySelector('body');
        base.compileFramework(settings, compileList);
        expect(settings.compileAngularjs).toHaveBeenCalled();
    });

    it('angular 数组解析', () => {
        settings = {
            compileAngularjs: jasmine.createSpy('callback')
        };
        compileList = [];
        compileList.push(document.createElement('div'));
        compileList.push(document.createElement('div'));
        compileList.push(document.createElement('div'));
        base.compileFramework(settings, compileList);
        expect(settings.compileAngularjs).toHaveBeenCalled();
    });

    it('react 单个解析', () => {
        settings = {
            compileReact: jasmine.createSpy('callback')
        };
        compileList = document.querySelector('body');
        base.compileFramework(settings, compileList);
        expect(settings.compileReact).toHaveBeenCalled();
    });

    it('react 数组解析', () => {
        settings = {
            compileReact: jasmine.createSpy('callback')
        };
        compileList = [];
        compileList.push(document.createElement('div'));
        compileList.push(document.createElement('div'));
        compileList.push(document.createElement('div'));
        base.compileFramework(settings, compileList);
        expect(settings.compileReact).toHaveBeenCalled();
    });

    it('结果验证: 正常', () => {
        settings = {
            compileAngularjs: () => {
                return new Promise((resolve, reject) => {
                    resolve('执行成功');
                });
            }
        };
        compileList = document.createElement('div');
        base.compileFramework(settings, compileList).then(res => {
            expect(res).toBeUndefined();
        });
    });

    it('结果验证: 异常', () => {
        settings = {
            compileVue: () => {
                throw new Error('返回一个错误');
            }
        };
        base.compileFramework(settings, compileList).catch(err => {
            expect(err).toBe('返回一个错误');
        });
    });
});
