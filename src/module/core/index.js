/*
 * core: 核心方法
 * 1.刷新
 * 2.渲染GM DOM
 * 3.重置tbody
 */
import './style.less';
import jTool from '@common/jTool';
import base from '@common/base';
import cache from '@common/cache';
import menu from '../menu';
import ajaxPage from '../ajaxPage';
import checkbox from '../checkbox';
import scroll from '../scroll';
import coreDOM from './coreDOM';
import transformToPromise from './transformToPromise';

class Core {
    /**
     * 刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
     * @param $table
     * @param callback
     * @private
     */
    refresh($table, callback) {
        const settings = cache.getSettings($table);

        const tableWrap = $table.closest('.table-wrap');

        // 更新刷新图标状态
        ajaxPage.updateRefreshIconState($table, true);

        base.showLoading(tableWrap, settings.loadingTemplate);

        let ajaxPromise = transformToPromise($table, settings);

        settings.ajax_beforeSend(ajaxPromise);
        ajaxPromise
        .then(response => {
            // 异步重新获取settings
            const settings = cache.getSettings($table);
            this.driveDomForSuccessAfter($table, settings, response, callback);
            settings.ajax_success(response);
            settings.ajax_complete(response);
            base.hideLoading(tableWrap);
            ajaxPage.updateRefreshIconState($table, false);
        })
        .catch(error => {
            settings.ajax_error(error);
            settings.ajax_complete(error);
            base.hideLoading(tableWrap);
            ajaxPage.updateRefreshIconState($table, false);
        });
    }

    /**
     * 清空当前表格数据
     * @param $table
     */
    cleanData($table) {
        const settings = cache.getSettings($table);
        this.insertEmptyTemplate($table, settings);
        cache.setTableData($table, []);

        // 渲染选择框
        if (settings.supportCheckbox) {
            checkbox.resetDOM($table, settings, []);
        }

        // 渲染分页
        if (settings.supportAjaxPage) {
            ajaxPage.resetPageData($table, settings, 0);
            menu.updateMenuPageStatus(settings.gridManagerName, settings);
        }
    }

    /**
     * 执行ajax成功后重新渲染DOM
     * @param $table
     * @param settings
     * @param response
     * @param callback
     */
    driveDomForSuccessAfter($table, settings, response, callback) {
        // 用于防止在填tbody时，实例已经被消毁的情况。
        if (!$table || $table.length === 0 || !$table.hasClass('GridManager-ready')) {
            return;
        }

        if (!response) {
            base.outLog('请求数据失败！请查看配置参数[ajax_data]是否配置正确，并查看通过该地址返回的数据格式是否正确', 'error');
            return;
        }

        let parseRes = typeof (response) === 'string' ? JSON.parse(response) : response;

        // 执行请求后执行程序, 通过该程序可以修改返回值格式
        parseRes = settings.responseHandler(base.cloneObject(parseRes));

        let _data = parseRes[settings.dataKey];
        let totals = parseRes[settings.totalsKey];

        // 数据校验: 数据异常
        if (!_data || !Array.isArray(_data)) {
            base.outLog(`请求数据失败！response中的${settings.dataKey}必须为数组类型，可通过配置项[dataKey]修改字段名。`, 'error');
            return;
        }

        // 数据校验: 未使用无总条数模式 且 总条数无效时直接跳出
        if (settings.supportAjaxPage && !settings.useNoTotalsMode && isNaN(parseInt(totals, 10))) {
            base.outLog('分页错误，请确认返回数据中是否存在totals字段(或配置项totalsKey所指定的字段)。', 'error');
            return;
        }

        // 数据为空时
        if (_data.length === 0) {
            this.insertEmptyTemplate($table, settings);
            parseRes[settings.totalsKey] = 0;
        } else {
            coreDOM.renderTableBody($table, settings, _data);
        }

        // 渲染选择框
        if (settings.supportCheckbox) {
            checkbox.resetDOM($table, settings, _data, settings.useRadio);
        }

        // 渲染分页
        if (settings.supportAjaxPage) {
            ajaxPage.resetPageData($table, settings, parseRes[settings.totalsKey], _data.length);
            menu.updateMenuPageStatus(settings.gridManagerName, settings);
        }

        typeof callback === 'function' ? callback(parseRes) : '';
    };

    /**
     * 插入空数据模板
     * @param $table
     * @param settings
     * @param isInit: 是否为初始化时调用
     */
    insertEmptyTemplate($table, settings, isInit) {
        // 当前为第一次加载 且 已经执行过setQuery 时，不再插入空数据模板
        // 用于解决容器为不可见时，触发了setQuery的情况
        if (isInit && cache.getTableData($table).length !== 0) {
            return;
        }

        let visibleNum = base.getVisibleTh($table).length;
        const $tbody = jTool('tbody', $table);
        const $tableDiv = $table.closest('.table-div');
        // height - 1的原因: 当设置disableLine=true时，会在高度正确的情况下出现y轴滚动条
        const style = `height: ${$tableDiv.height() - 1}px;`;
        $tbody.html(base.getEmptyHtml(visibleNum, settings.emptyTemplate, style));
        base.compileFramework(settings, {el: $tbody.get(0).querySelector('tr[emptyTemplate]')});
    }

    /**
     * 渲染HTML，根据配置嵌入所需的事件源DOM
     * @param $table
     * @param settings
     * @returns {Promise<any>}
     */
    async createDOM($table, settings) {
        coreDOM.init($table, settings);

        cache.setSettings(settings);

        // 单个table下的thead
        const $thead = base.getHead($table);

        // 单个table下的TH
        const $thList = jTool('th', $thead);

        // 单个table所在的DIV容器
        const $tableWarp = $table.closest('.table-wrap');

        // 等待容器可用
        await this.waitContainerAvailable(settings.gridManagerName, $tableWarp.get(0));

        // 重绘thead
        coreDOM.redrawThead($table, $tableWarp, $thList, settings);

        // 初始化fake thead
        scroll.init($table);

        // 解析框架: thead区域
        await base.compileFramework(settings, [{el: $thead.get(0).querySelector('tr')}]);

        // 删除渲染中标识、增加渲染完成标识
        $table.removeClass('GridManager-loading');
        $table.addClass('GridManager-ready');
    }

    /**
     * 等待容器可用
     * @param gridManagerName
     * @param tableWarp
     */
    waitContainerAvailable(gridManagerName, tableWarp) {
        return new Promise(resolve => {
            base.SIV_waitContainerAvailable[gridManagerName] = setInterval(() => {
                let tableWarpWidth = window.getComputedStyle(tableWarp).width;
                if (tableWarpWidth !== '100%') {
                    clearInterval(base.SIV_waitContainerAvailable[gridManagerName]);
                    base.SIV_waitContainerAvailable[gridManagerName] = null;
                    resolve();
                }
            }, 50);
        });
    }
}
export { coreDOM };
export default new Core();
