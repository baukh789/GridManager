/*
 * core: 核心方法
 * 1.刷新
 * 2.渲染GM DOM
 * 3.重置tbody
 */
import './style.less';
import { showLoading, hideLoading, getDiv, getTbody, getVisibleTh, getEmptyHtml, getEmpty, updateThWidth } from '@common/base';
import { outError, cloneObject } from '@common/utils';
import { getTableData, setTableData, getSettings, setSettings, SIV_waitContainerAvailable } from '@common/cache';
import { EMPTY_DATA_CLASS_NAME, WRAP_KEY, READY_CLASS_NAME } from '@common/constants';
import menu from '../menu';
import ajaxPage from '../ajaxPage';
import checkbox from '../checkbox';
import scroll from '../scroll';
import coreDOM from './coreDOM';
import { transformToPromise } from './tool';
import { sendCompile, compileEmptyTemplate, clearCompileList } from '@common/framework';

class Core {
    /**
     * 刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
     * @param gridManagerName
     * @param callback
     * @private
     */
    refresh(gridManagerName, callback) {
        const settings = getSettings(gridManagerName);
        const { loadingTemplate, ajaxBeforeSend, ajaxSuccess, ajaxError, ajaxComplete } = settings;
        // 更新刷新图标状态
        ajaxPage.updateRefreshIconState(gridManagerName, true);

        showLoading(gridManagerName, loadingTemplate);

        let ajaxPromise = transformToPromise(settings);

        ajaxBeforeSend(ajaxPromise);
        ajaxPromise
        .then(response => {
            // 异步重新获取settings
            try {
                const settings = getSettings(gridManagerName);
                this.driveDomForSuccessAfter(settings, response, callback);
                ajaxSuccess(response);
                ajaxComplete(response);
                hideLoading(gridManagerName);
                ajaxPage.updateRefreshIconState(gridManagerName, false);
            } catch (e) {
                console.error(e);
            }
        })
        .catch(error => {
            ajaxError(error);
            ajaxComplete(error);
            hideLoading(gridManagerName);
            ajaxPage.updateRefreshIconState(gridManagerName, false);
        });
    }

    /**
     * 清空当前表格数据
     * @param gridManagerName
     */
    cleanData(gridManagerName) {
        const settings = getSettings(gridManagerName);
        this.insertEmptyTemplate(settings);
        setTableData(gridManagerName, []);

        // 渲染选择框
        if (settings.supportCheckbox) {
            checkbox.resetDOM(gridManagerName, []);
        }

        // 渲染分页
        if (settings.supportAjaxPage) {
            ajaxPage.resetPageData(settings, 0);
            menu.updateMenuPageStatus(settings);
        }
    }

    /**
     * 执行ajax成功后重新渲染DOM
     * @param settings
     * @param response
     * @param callback
     */
    driveDomForSuccessAfter(settings, response, callback) {
        const { gridManagerName, rendered, responseHandler, supportCheckbox, supportAjaxPage, dataKey, totalsKey, useNoTotalsMode, asyncTotals, useRadio } = settings;

        // 用于防止在填tbody时，实例已经被消毁的情况。
        if (!rendered) {
            return;
        }

        if (!response) {
            outError('response undefined！please check ajaxData');
            return;
        }

        let parseRes = typeof (response) === 'string' ? JSON.parse(response) : response;

        // 执行请求后执行程序, 通过该程序可以修改返回值格式
        parseRes = responseHandler(cloneObject(parseRes));

        let _data = parseRes[dataKey];
        let totals = parseRes[totalsKey];

        // 数据校验: 数据异常
        if (!_data || !Array.isArray(_data)) {
            outError(`response.${dataKey} is not Array，please check dataKey`);
            return;
        }

        // 数据校验: 未使用无总条数模式 && 未使用异步总页 && 总条数无效时直接跳出
        if (supportAjaxPage && !useNoTotalsMode && !asyncTotals && isNaN(parseInt(totals, 10))) {
            outError(`response.${totalsKey} undefined，please check totalsKey`);
            return;
        }

        // 数据为空时
        if (_data.length === 0) {
            this.insertEmptyTemplate(settings);
            parseRes[totalsKey] = 0;
        } else {
            const $div = getDiv(gridManagerName);
            $div.removeClass(EMPTY_DATA_CLASS_NAME);
            $div.scrollTop(0);
            coreDOM.renderTableBody(settings, _data);
        }

        // 渲染选择框
        if (supportCheckbox) {
            checkbox.resetDOM(gridManagerName, _data, useRadio);
        }

        // 渲染分页
        if (supportAjaxPage) {
            ajaxPage.resetPageData(settings, parseRes[totalsKey], _data.length);
            menu.updateMenuPageStatus(settings);
        }

        typeof callback === 'function' ? callback(parseRes) : '';
    };

    /**
     * 插入空数据模板
     * @param settings
     * @param isInit: 是否为初始化时调用
     */
    insertEmptyTemplate(settings, isInit) {
        const { gridManagerName, emptyTemplate } = settings;
        // 当前为第一次加载 且 已经执行过setQuery 时，不再插入空数据模板
        // 用于解决容器为不可见时，触发了setQuery的情况
        if (isInit && getTableData(gridManagerName).length !== 0) {
            return;
        }

        let visibleNum = getVisibleTh(gridManagerName).length;
        const $tbody = getTbody(gridManagerName);
        const $tableDiv = getDiv(gridManagerName);
        const style = `height: ${$tableDiv.height() - 1}px;`;
        $tableDiv.addClass(EMPTY_DATA_CLASS_NAME);
        $tbody.html(getEmptyHtml(gridManagerName, visibleNum, style));
        const emptyTd = getEmpty(gridManagerName).get(0).querySelector('td');

        emptyTd.innerHTML = compileEmptyTemplate(settings, emptyTd, emptyTemplate);

        // 解析框架: 空模板
        sendCompile(settings);
    }

    /**
     * 渲染HTML，根据配置嵌入所需的事件源DOM
     * @param $table
     * @param settings
     * @returns {Promise<any>}
     */
    async createDOM($table, settings) {
        const gridManagerName = settings.gridManagerName;

        // 创建DOM前 先清空框架解析列表
        clearCompileList(gridManagerName);

        coreDOM.init($table, settings);

        setSettings(settings);

        // 等待容器可用
        await this.waitContainerAvailable(gridManagerName);

        // 重绘thead
        coreDOM.redrawThead(settings);

        // 初始化滚轴
        scroll.init(gridManagerName);

        // 解析框架: thead区域
        await sendCompile(settings, true);

        // 更新列宽
        updateThWidth(settings, true);


        // 增加渲染完成标识
        $table.addClass(READY_CLASS_NAME);
    }

    /**
     * 等待容器可用: 防止因容器的宽度不可用，而导致的列宽出错
     * @param gridManagerName
     */
    waitContainerAvailable(gridManagerName) {
        const tableWarp = document.querySelector(`[${WRAP_KEY}="${gridManagerName}"]`);
        return new Promise(resolve => {
            SIV_waitContainerAvailable[gridManagerName] = setInterval(() => {
                let tableWarpWidth = window.getComputedStyle(tableWarp).width;
                if (tableWarpWidth !== '100%') {
                    clearInterval(SIV_waitContainerAvailable[gridManagerName]);
                    SIV_waitContainerAvailable[gridManagerName] = null;
                    resolve();
                }
            }, 50);
        });
    }
}
export { coreDOM };
export default new Core();
