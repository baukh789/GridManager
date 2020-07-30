import render from '../../src/module/core/render';
import { clearCompileList } from '../../src/common/framework';

describe('core render', () => {
    describe('createWrapTpl', () => {
        let settings = null;
        let htmlStr = null;
        beforeEach(() => {
        });
        afterEach(() => {
            settings = null;
            htmlStr = null;
        });

        it('执行验证: 未开启条件项', () => {
            htmlStr = `
                <div class="table-wrap" grid-manager-wrap="test">
                    <div class="table-header"></div>
                    <div class="table-div" grid-manager-div="test"></div>
                    <span class="text-dreamland"></span>
                </div>
            `.replace(/\s/g, '');
            settings = {
                _: 'test',
                skinClassName: undefined,
                isIconFollowText: false,
                disableBorder: false,
                disableLine: false,
                supportConfig: false,
                supportAjaxPage: false
            };
            expect(render.createWrapTpl({settings}).replace(/\s/g, '')).toEqual(htmlStr);
        });

        it('执行验证: 增加皮肤标识', () => {
            htmlStr = `
                <div class="table-wrap ui-skin" grid-manager-wrap="test">
                    <div class="table-header"></div>
                    <div class="table-div" grid-manager-div="test"></div>
                    <span class="text-dreamland"></span>
                </div>
            `.replace(/\s/g, '');
            settings = {
                _: 'test',
                skinClassName: 'ui-skin',
                isIconFollowText: false,
                disableBorder: false,
                disableLine: false,
                supportConfig: false,
                supportAjaxPage: false
            };
            expect(render.createWrapTpl({settings}).replace(/\s/g, '')).toEqual(htmlStr);
        });

        it('执行验证: 增加跟随文本class', () => {
            htmlStr = `
                <div class="table-wrap ui-skin gm-icon-follow-text" grid-manager-wrap="test">
                    <div class="table-header"></div>
                    <div class="table-div" grid-manager-div="test"></div>
                    <span class="text-dreamland"></span>
                </div>
            `.replace(/\s/g, '');
            settings = {
                _: 'test',
                skinClassName: 'ui-skin',
                isIconFollowText: true,
                disableBorder: false,
                disableLine: false,
                supportConfig: false,
                supportAjaxPage: false
            };
            expect(render.createWrapTpl({settings}).replace(/\s/g, '')).toEqual(htmlStr);
        });

        it('执行验证: 增加禁用边框线标识', () => {
            htmlStr = `
                <div class="table-wrap ui-skin gm-icon-follow-text disable-border" grid-manager-wrap="test">
                    <div class="table-header"></div>
                    <div class="table-div" grid-manager-div="test"></div>
                    <span class="text-dreamland"></span>
                </div>
            `.replace(/\s/g, '');
            settings = {
                _: 'test',
                skinClassName: 'ui-skin',
                isIconFollowText: true,
                disableBorder: true,
                disableLine: false,
                supportConfig: false,
                supportAjaxPage: false
            };
            expect(render.createWrapTpl({settings}).replace(/\s/g, '')).toEqual(htmlStr);
        });

        it('执行验证: 增加禁用单元格分割线标识', () => {
            htmlStr = `
                <div class="table-wrap disable-line" grid-manager-wrap="test">
                    <div class="table-header"></div>
                    <div class="table-div" grid-manager-div="test"></div>
                    <span class="text-dreamland"></span>
                </div>
            `.replace(/\s/g, '');
            settings = {
                _: 'test',
                skinClassName: undefined,
                isIconFollowText: false,
                disableBorder: false,
                disableLine: true,
                supportConfig: false,
                supportAjaxPage: false
            };
            expect(render.createWrapTpl({settings}).replace(/\s/g, '')).toBe(htmlStr);
        });
    });

    describe('createThTpl', () => {
        let settings = null;
        let col = null;
        let htmlStr = null;
        beforeEach(() => {
            clearCompileList('test');
        });
        afterEach(() => {
            settings = null;
            htmlStr = null;
            col = null;
            clearCompileList('test');
        });

        it('执行验证: 未开启条件项', () => {
            htmlStr = `
                <th th-name="title" style="width:auto">
                    <div class="th-wrap">
                        <span class="th-text" >标题</span>
                    </div>
                </th>
            `.replace(/\s/g, '');
            settings = {
                _: 'test'
            };
            col = {
                key: 'title',
                text: () => '标题',  // 到这一步时，text已经被转换为function
                isShow: true
            };
            expect(render.createThTpl({ settings, col }).replace(/\s/g, '')).toBe(htmlStr);
        });

        it('执行验证: 开启表头提醒', () => {
            htmlStr = `
                <th th-name="title" style="width:auto" remind>
                    <div class="th-wrap">
                        <span class="th-text" >标题</span>
                    </div>
                </th>
            `.replace(/\s/g, '');
            settings = {
                _: 'test'
            };
            col = {
                key: 'title',
                remind: 'this is title',
                text: () => '标题',  // 到这一步时，text已经被转换为function
                isShow: true
            };
            expect(render.createThTpl({ settings, col }).replace(/\s/g, '')).toBe(htmlStr);
        });

        it('执行验证: 开启排序', () => {
            settings = {
                _: 'test',
                sortUpText: 'ASC',
                sortDownText: 'DESC',
                sortData: {}
            };

            // 排序方向为空
            htmlStr = `
                <th th-name="title" style="width:auto" sorting>
                    <div class="th-wrap">
                        <span class="th-text" >标题</span>
                    </div>
                </th>
            `.replace(/\s/g, '');
            col = {
                key: 'title',
                text: () => '标题',  // 到这一步时，text已经被转换为function
                isShow: true,
                sorting: ''
            };
            expect(render.createThTpl({ settings, col }).replace(/\s/g, '')).toBe(htmlStr);

            // 排序方向为下
            htmlStr = `
                <th th-name="title" style="width:auto" sorting="DESC">
                    <div class="th-wrap">
                        <span class="th-text" >标题</span>
                    </div>
                </th>
            `.replace(/\s/g, '');
            col = {
                key: 'title',
                text: () => '标题',  // 到这一步时，text已经被转换为function
                isShow: true,
                sorting: 'DESC'
            };
            expect(render.createThTpl({ settings, col }).replace(/\s/g, '')).toBe(htmlStr);

            // 排序方向为上
            htmlStr = `
                <th th-name="title" style="width:auto" sorting="ASC">
                    <div class="th-wrap">
                        <span class="th-text" >标题</span>
                    </div>
                </th>
            `.replace(/\s/g, '');
            col = {
                key: 'title',
                text: () => '标题',  // 到这一步时，text已经被转换为function
                isShow: true,
                sorting: 'ASC'
            };
            expect(render.createThTpl({ settings, col }).replace(/\s/g, '')).toBe(htmlStr);
        });

        it('执行验证: 开启过滤', () => {
            settings = {
                _: 'test',
                query: {}
            };

            // 配置项未选中
            htmlStr = `
                <th th-name="title" style="width:auto" filter>
                    <div class="th-wrap">
                        <span class="th-text" >标题</span>
                    </div>
                </th>
            `.replace(/\s/g, '');
            col = {
                key: 'title',
                text: () => '标题',  // 到这一步时，text已经被转换为function
                isShow: true,
                filter: {
                    selected: undefined
                }
            };
            expect(render.createThTpl({ settings, col }).replace(/\s/g, '')).toBe(htmlStr);


            // 配置项选中
            htmlStr = `
                <th th-name="title" style="width:auto" filter>
                    <div class="th-wrap">
                        <span class="th-text" >标题</span>
                    </div>
                </th>
            `.replace(/\s/g, '');
            col = {
                key: 'title',
                text: () => '标题',  // 到这一步时，text已经被转换为function
                isShow: true,
                filter: {
                    selected: '3'
                }
            };
            expect(render.createThTpl({ settings, col }).replace(/\s/g, '')).toBe(htmlStr);
            expect(settings.query.title).toBe('3');
        });

        it('执行验证: 开启固定列', () => {
            settings = {
                _: 'test'
            };

            // fixed: ''
            htmlStr = `
                <th th-name="title" style="width:auto">
                    <div class="th-wrap">
                        <span class="th-text" >标题</span>
                    </div>
                </th>
            `.replace(/\s/g, '');
            col = {
                key: 'title',
                text: () => '标题',  // 到这一步时，text已经被转换为function
                isShow: true,
                fixed: ''
            };
            expect(render.createThTpl({ settings, col }).replace(/\s/g, '')).toBe(htmlStr);

            // fixed: left
            htmlStr = `
                <th th-name="title" style="width:auto" fixed="left">
                    <div class="th-wrap">
                        <span class="th-text" >标题</span>
                    </div>
                </th>
            `.replace(/\s/g, '');
            col = {
                key: 'title',
                text: () => '标题',  // 到这一步时，text已经被转换为function
                isShow: true,
                fixed: 'left'
            };
            expect(render.createThTpl({ settings, col }).replace(/\s/g, '')).toBe(htmlStr);

            // fixed: right
            htmlStr = `
                <th th-name="title" style="width:auto" fixed="right">
                    <div class="th-wrap">
                        <span class="th-text" >标题</span>
                    </div>
                </th>
            `.replace(/\s/g, '');
            col = {
                key: 'title',
                text: () => '标题',  // 到这一步时，text已经被转换为function
                isShow: true,
                fixed: 'right'
            };
            expect(render.createThTpl({ settings, col }).replace(/\s/g, '')).toBe(htmlStr);
        });

        it('执行验证: align', () => {
            settings = {
                _: 'test'
            };

            // fixed: ''
            htmlStr = `
                <th th-name="title" style="width:auto" align="left">
                    <div class="th-wrap">
                        <span class="th-text" >标题</span>
                    </div>
                </th>
            `.replace(/\s/g, '');
            col = {
                key: 'title',
                text: () => '标题',  // 到这一步时，text已经被转换为function
                isShow: true,
                align: 'left'
            };
            expect(render.createThTpl({ settings, col }).replace(/\s/g, '')).toBe(htmlStr);
        });

        it('执行验证: 隐藏', () => {
            settings = {
                _: 'test'
            };

            // fixed: ''
            htmlStr = `
                <th th-name="title" style="width:auto" cell-hidden>
                    <div class="th-wrap">
                        <span class="th-text" >标题</span>
                    </div>
                </th>
            `.replace(/\s/g, '');
            col = {
                key: 'title',
                text: () => '标题',  // 到这一步时，text已经被转换为function
                isShow: false
            };
            expect(render.createThTpl({ settings, col }).replace(/\s/g, '')).toBe(htmlStr);
        });

        it('执行验证: 启用拖拽', () => {
            settings = {
                _: 'test',
                supportDrag: true
            };

            // fixed: ''
            htmlStr = `
                <th th-name="title" style="width:auto">
                    <div class="th-wrap">
                        <span class="th-text gm-drag-action" >标题</span>
                    </div>
                </th>
            `.replace(/\s/g, '');
            col = {
                key: 'title',
                text: () => '标题',  // 到这一步时，text已经被转换为function
                isShow: true
            };
            expect(render.createThTpl({ settings, col }).replace(/\s/g, '')).toBe(htmlStr);
        });

        it('执行验证: 行列合并', () => {
            settings = {
                _: 'test'
            };

            // fixed: ''
            htmlStr = `
                <th th-name="title" colspan="3" rowspan="2" style="width:auto">
                    <div class="th-wrap">
                        <span class="th-text" >标题</span>
                    </div>
                </th>
            `.replace(/\s/g, '');
            col = {
                key: 'title',
                text: () => '标题',  // 到这一步时，text已经被转换为function
                isShow: true,
                colspan: 3,
                rowspan: 2
            };
            expect(render.createThTpl({ settings, col }).replace(/\s/g, '')).toBe(htmlStr);
        });

        it('执行验证: 存在宽', () => {
            settings = {
                _: 'test'
            };

            // fixed: ''
            htmlStr = `
                <th th-name="title" style="width:120px">
                    <div class="th-wrap">
                        <span class="th-text" >标题</span>
                    </div>
                </th>
            `.replace(/\s/g, '');
            col = {
                key: 'title',
                text: () => '标题',  // 到这一步时，text已经被转换为function
                isShow: true,
                width: '120px'
            };
            expect(render.createThTpl({ settings, col }).replace(/\s/g, '')).toBe(htmlStr);
        });
    });
});
