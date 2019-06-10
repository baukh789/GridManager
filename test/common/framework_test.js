import framework from '@common/framework';
import tableTpl from '@test/table-test.tpl.html';
import { trimTpl } from '@common/parse';
import { CONSOLE_STYLE, CONSOLE_ERROR } from '@common/constants';

// 清除空格
const tableTestTpl = trimTpl(tableTpl);
describe('Framework', () => {
    let settings = null;
    let gridManagerName = null;
    beforeEach(() => {
        gridManagerName = 'test';
    });

    afterEach(() => {
        settings = null;
        gridManagerName = null;
        framework.compileList = [];
    });

    describe('getKey', () => {
        it('基础验证', () => {
            expect(framework.getKey).toBeDefined();
            expect(framework.getKey.length).toBe(1);
        });
        it('执行验证', () => {
            expect(framework.getKey()).toBe('data-compile-id-');
            expect(framework.getKey(gridManagerName)).toBe('data-compile-id-test');
            expect(framework.getKey('cc')).toBe('data-compile-id-cc');
        });
    });

    describe('compileFakeThead', () => {
        let fakeTheadTr = null;
        beforeEach(() => {
            document.body.innerHTML = tableTestTpl;
            fakeTheadTr = document.querySelector('thead[grid-manager-mock-thead="test"] tr');
            // 模拟未渲染前效果
            [].forEach.call(fakeTheadTr.querySelectorAll('th[gm-create="false"]'), (item, index) => {
                item.setAttribute('data-compile-id-test', index);
            });
        });

        afterEach(() => {
            document.body.innerHTML = '';
            [].forEach.call(fakeTheadTr.querySelectorAll('th[gm-create="false"]'), item => {
                item.removeAttribute('data-compile-id-test');
            });
            fakeTheadTr = null;
        });
        it('基础验证', () => {
            expect(framework.compileFakeThead).toBeDefined();
            expect(framework.compileFakeThead.length).toBe(2);
        });
        it('无框架', () => {
            settings = {
                gridManagerName
            };
            expect(framework.compileList.length).toBe(0);
            framework.compileFakeThead(settings, fakeTheadTr);
            expect(framework.compileList.length).toBe(0);
        });

        it('Angular-1.x', () => {
            settings = {
                gridManagerName,
                compileAngularjs: jasmine.createSpy('callback')
            };
            expect(framework.compileList.length).toBe(0);
            framework.compileFakeThead(settings, fakeTheadTr);
            expect(framework.compileList.length).toBe(8);
        });

        it('Vue', () => {
            settings = {
                gridManagerName,
                compileVue: jasmine.createSpy('callback')
            };
            expect(framework.compileList.length).toBe(0);
            framework.compileFakeThead(settings, fakeTheadTr);
            expect(framework.compileList.length).toBe(8);
        });

        it('React', () => {
            settings = {
                gridManagerName,
                compileReact: jasmine.createSpy('callback')
            };
            expect(framework.compileList.length).toBe(0);
            framework.compileFakeThead(settings, fakeTheadTr);
            expect(framework.compileList.length).toBe(8);
        });
    });

    describe('compileTh', () => {
        it('基础验证', () => {
            expect(framework.compileTh).toBeDefined();
            expect(framework.compileTh.length).toBe(2);
        });
        it('无框架', () => {
            settings = {
                gridManagerName
            };
            expect(framework.compileList.length).toBe(0);
            expect(framework.compileTh(settings, '标题')).toBe('');
            expect(framework.compileList.length).toBe(0);

        });
        it('Angular-1.x', () => {
            settings = {
                gridManagerName,
                compileAngularjs: jasmine.createSpy('callback')
            };

            expect(framework.compileList.length).toBe(0);
            expect(framework.compileTh(settings, '标题')).toBe('data-compile-id-test=0');
            expect(framework.compileList.length).toBe(1);
        });

        it('Vue', () => {
            settings = {
                gridManagerName,
                compileVue: jasmine.createSpy('callback')
            };

            expect(framework.compileList.length).toBe(0);
            expect(framework.compileTh(settings, '标题')).toBe('data-compile-id-test=0');
            expect(framework.compileList.length).toBe(1);
        });

        it('React', () => {
            settings = {
                gridManagerName,
                compileReact: jasmine.createSpy('callback')
            };

            expect(framework.compileList.length).toBe(0);
            expect(framework.compileTh(settings, '标题')).toBe('data-compile-id-test=0');
            expect(framework.compileList.length).toBe(1);
        });
    });

    describe('compileTd', () => {
        let tdNode = null;
        let row = null;
        let tdTemplate = null;
        beforeEach(() => {
            document.body.innerHTML = tableTestTpl;
            // 获取第一个非自动创建td
            tdNode = document.querySelector('tbody tr td[gm-create="false"]');
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
            document.body.innerHTML = '';
            tdNode = null;
            row = null;
            tdTemplate = null;
        });
        it('基础验证', () => {
            expect(framework.compileTd).toBeDefined();
            expect(framework.compileTd.length).toBe(6);
        });

        it('无框架: 模板为函数', () => {
            settings = {
                gridManagerName
            };
            tdTemplate = () => {
                return 'this is function';
            };
            expect(framework.compileList.length).toBe(0);
            expect(framework.compileTd(settings, tdNode, row, 1, 'pic', tdTemplate)).toBe('this is function');
            expect(framework.compileList.length).toBe(0);
        });

        it('无框架: 模板为字符串', () => {
            settings = {
                gridManagerName
            };
            tdTemplate = 'this is string';
            expect(framework.compileList.length).toBe(0);
            expect(framework.compileTd(settings, tdNode, row, 1, 'pic', tdTemplate)).toBe('this is string');
            expect(framework.compileList.length).toBe(0);
        });

        it('无框架: 模板为空', () => {
            settings = {
                gridManagerName
            };
            expect(framework.compileList.length).toBe(0);
            expect(framework.compileTd(settings, tdNode, row, 1, 'pic', tdTemplate)).toBe('/upload/blog/pic/9081_type.jpg');
            expect(framework.compileList.length).toBe(0);
        });

        it('Angular-1.x', () => {
            settings = {
                gridManagerName,
                compileAngularjs: jasmine.createSpy('callback')
            };

            expect(framework.compileList.length).toBe(0);
            expect(framework.compileTd(settings, tdNode, row, 1, 'pic', tdTemplate)).toBe('/upload/blog/pic/9081_type.jpg');
            expect(framework.compileList.length).toBe(1);
        });

        it('Vue', () => {
            settings = {
                gridManagerName,
                compileVue: jasmine.createSpy('callback')
            };

            expect(framework.compileList.length).toBe(0);
            expect(framework.compileTd(settings, tdNode, row, 1, 'pic', tdTemplate)).toBe('/upload/blog/pic/9081_type.jpg');
            expect(framework.compileList.length).toBe(1);
        });

        it('React: 无模板', () => {
            settings = {
                gridManagerName,
                compileReact: jasmine.createSpy('callback')
            };

            expect(framework.compileList.length).toBe(0);
            expect(framework.compileTd(settings, tdNode, row, 1, 'pic', tdTemplate)).toBe('/upload/blog/pic/9081_type.jpg');
            expect(framework.compileList.length).toBe(0);
        });

        it('React: 有模板', () => {
            settings = {
                gridManagerName,
                compileReact: jasmine.createSpy('callback')
            };

            tdTemplate = () => {
                return 'this is function';
            };
            expect(framework.compileList.length).toBe(0);
            expect(framework.compileTd(settings, tdNode, row, 1, 'pic', tdTemplate)).toBe('');
            expect(framework.compileList.length).toBe(1);
        });
    });

    describe('compileEmptyTemplate', () => {
        let emptyNode = null;
        let template = null;
        beforeEach(() => {
            template = '<div>空空的，什么也没有</div>';
            document.body.innerHTML = '<table><tbody><td empty-node></td></tbody></table>';
            emptyNode = document.querySelector('td[empty-node]');
        });
        afterEach(() => {
            document.body.innerHTML = '';
            emptyNode = null;
            template = null;
        });
        it('基础验证', () => {
            expect(framework.compileEmptyTemplate).toBeDefined();
            expect(framework.compileEmptyTemplate.length).toBe(3);
        });

        it('无框架', () => {
            settings = {
                gridManagerName
            };
            expect(framework.compileList.length).toBe(0);
            expect(framework.compileEmptyTemplate(settings, emptyNode, template)).toBeUndefined();
            expect(framework.compileList.length).toBe(0);
        });

        it('Angular-1.x', () => {
            settings = {
                gridManagerName,
                compileAngularjs: jasmine.createSpy('callback')
            };

            expect(framework.compileList.length).toBe(0);
            expect(framework.compileEmptyTemplate(settings, emptyNode, template)).toBeUndefined();
            expect(framework.compileList.length).toBe(1);
        });

        it('Vue', () => {
            settings = {
                gridManagerName,
                compileVue: jasmine.createSpy('callback')
            };

            expect(framework.compileList.length).toBe(0);
            expect(framework.compileEmptyTemplate(settings, emptyNode, template)).toBeUndefined();
            expect(framework.compileList.length).toBe(1);
        });

        it('React', () => {
            settings = {
                gridManagerName,
                compileReact: jasmine.createSpy('callback')
            };

            expect(framework.compileList.length).toBe(0);
            expect(framework.compileEmptyTemplate(settings, emptyNode, template)).toBe('');
            expect(framework.compileList.length).toBe(1);
        });
    });

    describe('compileFullColumn', () => {
        let fullNode = null;
        let row = null;
        let template = null;
        beforeEach(() => {
            document.body.innerHTML = '<table><tbody><tr><td colspan="1"><div class="full-column-td"></div></td></tr></tbody></table>';
            fullNode = document.querySelector('tbody div.full-column-td');
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
            document.body.innerHTML = '';
            fullNode = null;
            row = null;
            template = null;
        });
        it('基础验证', () => {
            expect(framework.compileFullColumn).toBeDefined();
            expect(framework.compileFullColumn.length).toBe(5);
        });

        it('无模板', () => {
            settings = {
                gridManagerName
            };
            expect(framework.compileList.length).toBe(0);
            expect(framework.compileFullColumn(settings, fullNode, row, 1, template)).toBe('');
            expect(framework.compileList.length).toBe(0);
        });

        it('无框架', () => {
            settings = {
                gridManagerName
            };

            // 函数模板
            template = () => {
                return '<div>这个是通栏</div>';
            };
            expect(framework.compileList.length).toBe(0);
            expect(framework.compileFullColumn(settings, fullNode, row, 1, template)).toBe('<div>这个是通栏</div>');
            expect(framework.compileList.length).toBe(0);


            // 字符模板
            template = '<div>这个是通栏</div>';
            expect(framework.compileList.length).toBe(0);
            expect(framework.compileFullColumn(settings, fullNode, row, 1, template)).toBe('<div>这个是通栏</div>');
            expect(framework.compileList.length).toBe(0);
        });

        it('Angular-1.x', () => {
            settings = {
                gridManagerName,
                compileAngularjs: jasmine.createSpy('callback')
            };

            template = () => {
                return '<div>这个是通栏</div>';
            };
            expect(framework.compileList.length).toBe(0);
            expect(framework.compileFullColumn(settings, fullNode, row, 1, template)).toBe('<div>这个是通栏</div>');
            expect(framework.compileList.length).toBe(1);
        });

        it('Vue', () => {
            settings = {
                gridManagerName,
                compileVue: jasmine.createSpy('callback')
            };

            template = () => {
                return '<div>这个是通栏</div>';
            };
            expect(framework.compileList.length).toBe(0);
            expect(framework.compileFullColumn(settings, fullNode, row, 1, template)).toBe('<div>这个是通栏</div>');
            expect(framework.compileList.length).toBe(1);
        });

        it('React', () => {
            settings = {
                gridManagerName,
                compileReact: jasmine.createSpy('callback')
            };

            template = () => {
                return '<div>这个是通栏</div>';
            };
            expect(framework.compileList.length).toBe(0);
            expect(framework.compileFullColumn(settings, fullNode, row, 1, template)).toBe('');
            expect(framework.compileList.length).toBe(1);
        });
    });


    describe('send', () => {
        beforeEach(() => {
            gridManagerName = 'test';
            console._log = console.log;
            console.log = jasmine.createSpy('log');
        });

        afterEach(() => {
            settings = null;
            gridManagerName = null;
            console.log = console._log;
            framework.compileList = [];
        });
        it('基础验证', () => {
            expect(framework.send).toBeDefined();
            expect(framework.send.length).toBe(2);
        });

        it('没有要发送的数据', () => {
            settings = {
                gridManagerName
            };
            framework.send(settings);
            expect(framework.compileList.length).toBe(0);
        });

        it('通过属性更新element', () => {
            settings = {
                gridManagerName
            };
            framework.compileList = [{template: '测试一下'}, {template: '测试二下'}];
            framework.send(settings, true);
            expect(framework.compileList.length).toBe(0);
        });

        it('Angular-1.x', () => {
            framework.compileList = [{template: '测试一下'}, {template: '测试二下'}];
            settings = {
                gridManagerName,
                compileAngularjs: jasmine.createSpy('callback')
            };
            expect(framework.compileList.length).toBe(2);
            framework.send(settings).then(res => {
                expect(settings.compileAngularjs).toHaveBeenCalled();
                expect(framework.compileList.length).toBe(0);
            });
        });

        it('Vue', () => {
            framework.compileList = [{template: '测试一下'}, {template: '测试二下'}];
            settings = {
                gridManagerName,
                compileVue: jasmine.createSpy('callback')
            };
            expect(framework.compileList.length).toBe(2);
            framework.send(settings).then(res => {
                expect(settings.compileVue).toHaveBeenCalled();
                expect(framework.compileList.length).toBe(0);
            });
        });

        it('React', () => {
            framework.compileList = [{template: '测试一下'}, {template: '测试二下'}];
            settings = {
                gridManagerName,
                compileReact: jasmine.createSpy('callback')
            };
            expect(framework.compileList.length).toBe(2);
            framework.send(settings).then(res => {
                expect(settings.compileReact).toHaveBeenCalled();
                expect(framework.compileList.length).toBe(0);
            });
        });

        it('结果验证: 异常', () => {
            settings = {
                compileVue: () => {
                    throw new Error('返回一个错误');
                }
            };
            framework.send(settings).catch(err => {
                expect(err).toBe('返回一个错误');
                expect(console.log).toHaveBeenCalledWith('%c GridManager Error %c parse framework template error。 返回一个错误 ', ...CONSOLE_STYLE[CONSOLE_ERROR]);
            });
        });
    });
});
