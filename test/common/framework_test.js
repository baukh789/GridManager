import { getCompileList, clearCompileList, compileFakeThead, compileTh, compileTd, compileEmptyTemplate, compileFullColumn, sendCompile } from '@common/framework';
import tableTpl from '@test/table-test.tpl.html';
const FRAMEWORK_KEY = 'data-compile-node';
// 清除空格
const tableTestTpl = tableTpl;
describe('Framework', () => {
    let settings = null;
    let gridManagerName = null;
    beforeEach(() => {
        gridManagerName = 'test';
    });

    afterEach(() => {
        settings = null;
        clearCompileList(gridManagerName);
        gridManagerName = null;
    });

    describe('getCompileList', () => {
        it('基础验证', () => {
            expect(getCompileList).toBeDefined();
            expect(getCompileList.length).toBe(1);
        });
        it('执行验证', () => {
            expect(getCompileList()).toEqual([]);
        });
    });

    describe('clearCompileList', () => {
        it('基础验证', () => {
            expect(clearCompileList).toBeDefined();
            expect(clearCompileList.length).toBe(1);
        });
        it('执行验证', () => {
            expect(clearCompileList(gridManagerName)).toBeUndefined();
        });
    });

    describe('compileFakeThead', () => {
        let fakeTheadTr = null;
        beforeEach(() => {
            document.body.innerHTML = tableTestTpl;
            fakeTheadTr = document.querySelector('thead[grid-manager-mock-thead="test"] tr');
            // 模拟未渲染前效果
            [].forEach.call(fakeTheadTr.querySelectorAll('th[gm-create="false"]'), (item, index) => {
                item.setAttribute(FRAMEWORK_KEY, index);
            });
        });

        afterEach(() => {
            document.body.innerHTML = '';
            [].forEach.call(fakeTheadTr.querySelectorAll('th[gm-create="false"]'), item => {
                item.removeAttribute(FRAMEWORK_KEY);
            });
            fakeTheadTr = null;
        });
        it('基础验证', () => {
            expect(compileFakeThead).toBeDefined();
            expect(compileFakeThead.length).toBe(2);
        });
        it('无框架', () => {
            settings = {
                gridManagerName
            };
            expect(getCompileList(gridManagerName).length).toBe(0);
            compileFakeThead(settings, fakeTheadTr);
            expect(getCompileList(gridManagerName).length).toBe(0);
        });

        it('Angular-1.x', () => {
            settings = {
                gridManagerName,
                compileAngularjs: jasmine.createSpy('callback')
            };
            expect(getCompileList(gridManagerName).length).toBe(0);
            compileFakeThead(settings, fakeTheadTr);
            expect(getCompileList(gridManagerName).length).toBe(8);
        });

        it('Vue', () => {
            settings = {
                gridManagerName,
                compileVue: jasmine.createSpy('callback')
            };
            expect(getCompileList(gridManagerName).length).toBe(0);
            compileFakeThead(settings, fakeTheadTr);
            expect(getCompileList(gridManagerName).length).toBe(8);
        });

        it('React', () => {
            settings = {
                gridManagerName,
                compileReact: jasmine.createSpy('callback')
            };
            expect(getCompileList(gridManagerName).length).toBe(0);
            compileFakeThead(settings, fakeTheadTr);
            expect(getCompileList(gridManagerName).length).toBe(8);
        });
    });

    describe('compileTh', () => {
        it('基础验证', () => {
            expect(compileTh).toBeDefined();
            expect(compileTh.length).toBe(3);
        });
        it('无框架', () => {
            settings = {
                gridManagerName
            };
            expect(getCompileList(gridManagerName).length).toBe(0);
            expect(compileTh(settings, 'title', () => '标题').text).toBe('标题');
            expect(compileTh(settings, 'title', () => '标题').compileAttr).toBe('');
            expect(getCompileList(gridManagerName).length).toBe(0);

        });
        it('Angular-1.x', () => {
            settings = {
                gridManagerName,
                compileAngularjs: jasmine.createSpy('callback')
            };

            expect(getCompileList(gridManagerName).length).toBe(0);
            let obj = compileTh(settings, 'title', () => '标题');
            expect(obj.text).toBe('标题');
            expect(obj.compileAttr).toBe(FRAMEWORK_KEY);
            expect(getCompileList(gridManagerName).length).toBe(1);
            obj = null;
        });

        it('Vue', () => {
            settings = {
                gridManagerName,
                compileVue: jasmine.createSpy('callback')
            };

            expect(getCompileList(gridManagerName).length).toBe(0);
            let obj = compileTh(settings, 'title', () => '标题');
            expect(obj.text).toBe('标题');
            expect(obj.compileAttr).toBe(FRAMEWORK_KEY);
            expect(getCompileList(gridManagerName).length).toBe(1);
            obj = null;
        });

        it('React', () => {
            settings = {
                gridManagerName,
                compileReact: jasmine.createSpy('callback')
            };

            expect(getCompileList(gridManagerName).length).toBe(0);
            let obj = compileTh(settings, 'title', () => '标题');
            expect(obj.text).toBe('');
            expect(obj.compileAttr).toBe(FRAMEWORK_KEY);
            expect(getCompileList(gridManagerName).length).toBe(1);
            obj = null;
        });
    });

    describe('compileTd', () => {
        let data = null;
        let row = null;
        let tdTemplate = null;
        beforeEach(() => {
            // 获取第一个非自动创建td
            row = {
                'id': 92,
                'title': 'Content-Type 对照表',
                'subtitle': 'Content-Type,Mime-Type',
                'pic': '/upload/blog/pic/9081_type.jpg',
                'createDate': 1533263664000,
                'lastDate': 1533276847970,
                'author': '33',
                'type': 3,
                'status': 1,
                'info': 'Content-Type(Mime-Type)对照表, 有不全的会继续更新',
                'readNumber': 331,
                'praiseNumber': '0',
                'commentSum': 0,
                'username': '拭目以待',
                'photo': '/upload/user/photo/8495_1.jpg'
            };
        });

        afterEach(() => {
            data = null;
            row = null;
            tdTemplate = null;
        });
        it('基础验证', () => {
            expect(compileTd).toBeDefined();
            expect(compileTd.length).toBe(5);
        });

        it('无框架: 模板为函数', () => {
            settings = {
                gridManagerName
            };
            tdTemplate = () => {
                return 'this is function';
            };
            expect(getCompileList(gridManagerName).length).toBe(0);

            data = compileTd(settings, tdTemplate, row, 1, 'pic');
            expect(data.text).toBe('this is function');
            expect(data.compileAttr).toBe('');
            expect(getCompileList(gridManagerName).length).toBe(0);
        });

        it('无框架: 模板为空', () => {
            settings = {
                gridManagerName
            };
            expect(getCompileList(gridManagerName).length).toBe(0);

            data = compileTd(settings, tdTemplate, row, 1, 'pic');
            expect(data.text).toBe('/upload/blog/pic/9081_type.jpg');
            expect(data.compileAttr).toBe('');
            expect(getCompileList(gridManagerName).length).toBe(0);
        });

        it('Angular-1.x: 无模板', () => {
            settings = {
                gridManagerName,
                compileAngularjs: jasmine.createSpy('callback')
            };

            expect(getCompileList(gridManagerName).length).toBe(0);

            data = compileTd(settings, tdTemplate, row, 1, 'pic');
            expect(data.text).toBe('/upload/blog/pic/9081_type.jpg');
            expect(data.compileAttr).toBe('');
            expect(getCompileList(gridManagerName).length).toBe(0);
        });

        it('Angular-1.x: 有模板', () => {
            settings = {
                gridManagerName,
                compileAngularjs: jasmine.createSpy('callback')
            };

            tdTemplate = (pic, row, index) => {
                return 'this is function' + pic + index;
            };
            expect(getCompileList(gridManagerName).length).toBe(0);

            data = compileTd(settings, tdTemplate, row, 1, 'pic');
            expect(data.text).toBe('this is function/upload/blog/pic/9081_type.jpg1');
            expect(data.compileAttr).toBe(FRAMEWORK_KEY);
            expect(getCompileList(gridManagerName).length).toBe(1);

            data = compileTd(settings, tdTemplate, row, 1, 'pic');
            expect(data.text).toBe('this is function/upload/blog/pic/9081_type.jpg1');
            expect(data.compileAttr).toBe(FRAMEWORK_KEY);
            expect(getCompileList(gridManagerName).length).toBe(2);
        });

        it('Vue: 无模板', () => {
            settings = {
                gridManagerName,
                compileVue: jasmine.createSpy('callback')
            };

            expect(getCompileList(gridManagerName).length).toBe(0);

            data = compileTd(settings, tdTemplate, row, 1, 'pic');
            expect(data.text).toBe('/upload/blog/pic/9081_type.jpg');
            expect(data.compileAttr).toBe('');
            expect(getCompileList(gridManagerName).length).toBe(0);
        });

        it('Vue: 有模板', () => {
            settings = {
                gridManagerName,
                compileVue: jasmine.createSpy('callback')
            };

            tdTemplate = (pic, row, index) => {
                return 'this is function' + pic + index;
            };
            expect(getCompileList(gridManagerName).length).toBe(0);

            data = compileTd(settings, tdTemplate, row, 1, 'pic');
            expect(data.text).toBe('this is function/upload/blog/pic/9081_type.jpg1');
            expect(data.compileAttr).toBe(FRAMEWORK_KEY);
            expect(getCompileList(gridManagerName).length).toBe(1);
        });

        it('React: 无模板', () => {
            settings = {
                gridManagerName,
                compileReact: jasmine.createSpy('callback')
            };

            expect(getCompileList(gridManagerName).length).toBe(0);

            data = compileTd(settings, tdTemplate, row, 1, 'pic');
            expect(data.text).toBe('/upload/blog/pic/9081_type.jpg');
            expect(data.compileAttr).toBe('');
            expect(getCompileList(gridManagerName).length).toBe(0);
        });

        it('React: 有模板', () => {
            settings = {
                gridManagerName,
                compileReact: jasmine.createSpy('callback')
            };

            tdTemplate = () => {
                return 'this is function';
            };
            expect(getCompileList(gridManagerName).length).toBe(0);

            data = compileTd(settings, tdTemplate, row, 1, 'pic');
            expect(data.text).toBe('');
            expect(data.compileAttr).toBe(FRAMEWORK_KEY);
            expect(getCompileList(gridManagerName).length).toBe(1);
        });
    });

    describe('compileEmptyTemplate', () => {
        let emptyNode = null;
        let template = null;
        beforeEach(() => {
            template = settings => settings.query?.title ? '<div>查询结果为空</div>' : '<div>空空的，什么也没有</div>';
            document.body.innerHTML = '<table><tbody><td empty-node></td></tbody></table>';
            emptyNode = document.querySelector('td[empty-node]');
        });
        afterEach(() => {
            document.body.innerHTML = '';
            emptyNode = null;
            template = null;
        });
        it('基础验证', () => {
            expect(compileEmptyTemplate).toBeDefined();
            expect(compileEmptyTemplate.length).toBe(3);
        });

        it('无框架', () => {
            settings = {
                gridManagerName,
                query: {
                    title: '测试的'
                }
            };
            expect(getCompileList(gridManagerName).length).toBe(0);
            expect(compileEmptyTemplate(settings, emptyNode, template)).toBe('<div>查询结果为空</div>');
            expect(getCompileList(gridManagerName).length).toBe(0);
        });

        it('Angular-1.x', () => {
            settings = {
                gridManagerName,
                compileAngularjs: jasmine.createSpy('callback')
            };

            expect(getCompileList(gridManagerName).length).toBe(0);
            expect(compileEmptyTemplate(settings, emptyNode, template)).toBe('<div>空空的，什么也没有</div>');
            expect(getCompileList(gridManagerName).length).toBe(1);
        });

        it('Vue', () => {
            settings = {
                gridManagerName,
                compileVue: jasmine.createSpy('callback')
            };

            expect(getCompileList(gridManagerName).length).toBe(0);
            expect(compileEmptyTemplate(settings, emptyNode, template)).toBe('<div>空空的，什么也没有</div>');
            expect(getCompileList(gridManagerName).length).toBe(1);
        });

        it('React', () => {
            settings = {
                gridManagerName,
                compileReact: jasmine.createSpy('callback')
            };

            expect(getCompileList(gridManagerName).length).toBe(0);
            expect(compileEmptyTemplate(settings, emptyNode, template)).toBe('');
            expect(getCompileList(gridManagerName).length).toBe(1);
        });
    });

    describe('compileFullColumn', () => {
        let data = null;
        let row = null;
        let template = null;
        beforeEach(() => {
            row = {
                'id': 92,
                'title': 'Content-Type 对照表',
                'subtitle': 'Content-Type,Mime-Type',
                'pic': '/upload/blog/pic/9081_type.jpg',
                'createDate': 1533263664000,
                'lastDate': 1533276847970,
                'author': '33',
                'type': 3,
                'status': 1,
                'info': 'Content-Type(Mime-Type)对照表, 有不全的会继续更新',
                'readNumber': 331,
                'praiseNumber': '0',
                'commentSum': 0,
                'username': '拭目以待',
                'photo': '/upload/user/photo/8495_1.jpg'
            };
        });

        afterEach(() => {
            data = null;
            row = null;
            template = null;
        });
        it('基础验证', () => {
            expect(compileFullColumn).toBeDefined();
            expect(compileFullColumn.length).toBe(4);
        });

        it('无框架', () => {
            settings = {
                gridManagerName
            };

            template = () => {
                return '<div>这个是通栏</div>';
            };
            expect(getCompileList(gridManagerName).length).toBe(0);

            data = compileFullColumn(settings, row, 1, template);
            expect(data.text).toBe('<div>这个是通栏</div>');
            expect(data.compileAttr).toBe('');
            expect(getCompileList(gridManagerName).length).toBe(0);
        });

        it('Angular-1.x', () => {
            settings = {
                gridManagerName,
                compileAngularjs: jasmine.createSpy('callback')
            };

            template = () => {
                return '<div>这个是通栏</div>';
            };
            expect(getCompileList(gridManagerName).length).toBe(0);

            data = compileFullColumn(settings, row, 1, template);
            expect(data.text).toBe('<div>这个是通栏</div>');
            expect(data.compileAttr).toBe(FRAMEWORK_KEY);
            expect(getCompileList(gridManagerName).length).toBe(1);
        });

        it('Vue', () => {
            settings = {
                gridManagerName,
                compileVue: jasmine.createSpy('callback')
            };

            template = () => {
                return '<div>这个是通栏</div>';
            };
            expect(getCompileList(gridManagerName).length).toBe(0);

            data = compileFullColumn(settings, row, 1, template);
            expect(data.text).toBe('<div>这个是通栏</div>');
            expect(data.compileAttr).toBe(FRAMEWORK_KEY);
            expect(getCompileList(gridManagerName).length).toBe(1);
        });

        it('React', () => {
            settings = {
                gridManagerName,
                compileReact: jasmine.createSpy('callback')
            };

            template = () => {
                return '<div>这个是通栏</div>';
            };
            expect(getCompileList(gridManagerName).length).toBe(0);

            data = compileFullColumn(settings, row, 1, template);
            expect(data.text).toBe('');
            expect(data.compileAttr).toBe(FRAMEWORK_KEY);
            expect(getCompileList(gridManagerName).length).toBe(1);
        });
    });


    describe('send', () => {
        let compileList = null;
        beforeEach(() => {
            compileList = getCompileList(gridManagerName);
            document.body.innerHTML = `<table grid-manager="${gridManagerName}"><tbody><tr><td ${FRAMEWORK_KEY}></td><td ${FRAMEWORK_KEY}></td></tr></tbody></table>`;
        });

        afterEach(() => {
            compileList = null;
            document.body.innerHTML = '';
        });
        it('基础验证', () => {
            expect(sendCompile).toBeDefined();
            expect(sendCompile.length).toBe(1);
        });

        it('没有要发送的数据', () => {
            settings = {
                gridManagerName
            };
            expect(sendCompile(settings) instanceof Promise).toBe(true);
            expect(getCompileList(gridManagerName).length).toBe(0);
        });

        it('通过属性更新element', () => {
            settings = {
                gridManagerName
            };
            compileList.push({template: '测试一下'});
            compileList.push({template: '测试二下'});
            expect(document.querySelectorAll(`[grid-manager="${gridManagerName}"] [${FRAMEWORK_KEY}]`).length).toBe(2);
            sendCompile(settings);
            expect(document.querySelectorAll(`[grid-manager="${gridManagerName}"] [${FRAMEWORK_KEY}]`).length).toBe(0);
            expect(getCompileList(gridManagerName).length).toBe(0);
        });

        it('Angular-1.x', () => {
            compileList.push({template: '测试一下', el: document.querySelector(`td[${FRAMEWORK_KEY}]`)});
            compileList.push({template: '测试二下', el: document.querySelector(`td[${FRAMEWORK_KEY}]`)});
            settings = {
                gridManagerName,
                compileAngularjs: jasmine.createSpy('callback')
            };
            expect(getCompileList(gridManagerName).length).toBe(2);
            expect(document.querySelectorAll(`[grid-manager="${gridManagerName}"] [${FRAMEWORK_KEY}]`).length).toBe(2);
            sendCompile(settings).then(res => {
                expect(settings.compileAngularjs).toHaveBeenCalled();
                expect(document.querySelectorAll(`[grid-manager="${gridManagerName}"] [${FRAMEWORK_KEY}]`).length).toBe(0);
                expect(getCompileList(gridManagerName).length).toBe(0);
            });
        });

        it('Vue', () => {
            compileList.push({template: '测试一下', el: document.querySelector(`td[${FRAMEWORK_KEY}]`)});
            compileList.push({template: '测试二下', el: document.querySelector(`td[${FRAMEWORK_KEY}]`)});
            settings = {
                gridManagerName,
                compileVue: jasmine.createSpy('callback')
            };
            expect(getCompileList(gridManagerName).length).toBe(2);
            expect(document.querySelectorAll(`[grid-manager="${gridManagerName}"] [${FRAMEWORK_KEY}]`).length).toBe(2);
            sendCompile(settings).then(res => {
                expect(settings.compileVue).toHaveBeenCalled();
                expect(document.querySelectorAll(`[grid-manager="${gridManagerName}"] [${FRAMEWORK_KEY}]`).length).toBe(0);
                expect(getCompileList(gridManagerName).length).toBe(0);
            });
        });

        it('React', () => {
            compileList.push({template: '测试一下', el: document.querySelector(`td[${FRAMEWORK_KEY}]`)});
            compileList.push({template: '测试二下', el: document.querySelector(`td[${FRAMEWORK_KEY}]`)});
            settings = {
                gridManagerName,
                compileReact: jasmine.createSpy('callback')
            };
            expect(getCompileList(gridManagerName).length).toBe(2);
            expect(document.querySelectorAll(`[grid-manager="${gridManagerName}"] [${FRAMEWORK_KEY}]`).length).toBe(2);
            sendCompile(settings).then(res => {
                expect(settings.compileReact).toHaveBeenCalled();
                expect(document.querySelectorAll(`[grid-manager="${gridManagerName}"] [${FRAMEWORK_KEY}]`).length).toBe(0);
                expect(getCompileList(gridManagerName).length).toBe(0);
            });
        });
    });
});
