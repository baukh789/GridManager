/*
 * core: 核心方法
 * 1.刷新
 * 2.渲染GM DOM
 * 3.重置tbody
 */
import './style.less';
import { isString, isFunction, isArray, getStyle, rootDocument } from '@jTool/utils';
import { showLoading, hideLoading, getDiv, getTbody, getVisibleTh, getEmpty } from '@common/base';
import { cloneObject, outError } from '@common/utils';
import { getTableData, setTableData, setCheckedData, getSettings, setSettings, SIV_waitContainerAvailable } from '@common/cache';
import { EMPTY_DATA_CLASS_NAME, WRAP_KEY, EMPTY_TPL_KEY, PX } from '@common/constants';
import { clearMenuDOM } from '../menu/tool';
import ajaxPage from '../ajaxPage';
import { resetCheckboxDOM } from '../checkbox';
import scroll from '../scroll';
import coreDOM from './coreDOM';
import { transformToPromise } from './tool';
import { sendCompile, compileEmptyTemplate, clearCompileList } from '@common/framework';
import { SettingObj, JTool } from 'typings/types';

class Core {
    /**
     * 刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
     * @param _
     * @param callback
     * @private
     */
    refresh(_: string, callback?: any): void {
        const settings = getSettings(_);
        const { disableAutoLoading, loadingTemplate, ajaxBeforeSend, ajaxSuccess, ajaxError, ajaxComplete, checkboxConfig } = settings;

        // 禁用状态保持: 指定在刷新类操作时(搜索、刷新、分页、排序、过滤)，清除选中状态
        if (checkboxConfig.disableStateKeep) {
            setCheckedData(_, [], true);
        }

        // 更新刷新图标状态
        ajaxPage.updateRefreshIconState(_, true);

        !disableAutoLoading && showLoading(_, loadingTemplate);

        let ajaxPromise = transformToPromise(settings);

        ajaxBeforeSend(ajaxPromise);
        ajaxPromise.then((response: object) => {
            // 异步重新获取settings
            try {
                const settings = getSettings(_);
                // setTimeout的作用: 当数据量过大时，用于保证表头提前显示
                setTimeout(() => {
                    this.driveDomForSuccessAfter(settings, response, callback);
                    ajaxSuccess(response);
                    ajaxComplete(response);
                    !disableAutoLoading && hideLoading(_);
                    ajaxPage.updateRefreshIconState(_, false);
                });
            } catch (e) {
                console.error(e);
            }
        })
        .catch((error: Error) => {
            ajaxError(error);
            ajaxComplete(error);
            !disableAutoLoading && hideLoading(_);
            ajaxPage.updateRefreshIconState(_, false);
        });
    }

    /**
     * 执行ajax成功后重新渲染DOM
     * @param settings
     * @param response
     * @param callback
     */
    async driveDomForSuccessAfter(settings: SettingObj, response: object | string, callback?: any): Promise<any> {
        const { _, rendered, responseHandler, supportCheckbox, supportAjaxPage, supportMenu, checkboxConfig, dataKey, totalsKey, useNoTotalsMode, asyncTotals } = settings;

        // 用于防止在填tbody时，实例已经被消毁的情况。
        if (!rendered) {
            return;
        }

        if (!response) {
            outError('response undefined！please check ajaxData');
            return;
        }

        let parseRes = isString(response) ? JSON.parse(response as string) : response;

        // 执行请求后执行程序, 通过该程序可以修改返回值格式
        parseRes = responseHandler(cloneObject(parseRes));

        let _data = parseRes[dataKey];
        let totals = parseRes[totalsKey];

        // 数据校验: 数据异常
        if (!_data || !isArray(_data)) {
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
            setTableData(_, []);
        } else {
            const $div = getDiv(_);
            $div.removeClass(EMPTY_DATA_CLASS_NAME);
            $div.scrollTop(0);
            await coreDOM.renderTableBody(settings, _data);
        }

        // 渲染选择框
        if (supportCheckbox) {
            resetCheckboxDOM(_, _data, checkboxConfig.useRadio, checkboxConfig.max);
        }

        // 渲染分页
        if (supportAjaxPage) {
            ajaxPage.resetPageData(settings, parseRes[totalsKey], _data.length);
        }

        // 右键菜单
        if (supportMenu) {
            clearMenuDOM(_);
        }

        isFunction(callback) ? callback(parseRes) : '';
    };

    /**
     * 插入空数据模板
     * @param settings
     * @param isInit: 是否为初始化时调用
     */
    insertEmptyTemplate(settings: SettingObj, isInit?: boolean): void {
        const { _, emptyTemplate } = settings;
        // 当前为第一次加载 且 已经执行过setQuery 时，不再插入空数据模板
        // 用于解决容器为不可见时，触发了setQuery的情况
        if (isInit && getTableData(_).length !== 0) {
            return;
        }

        const $tableDiv = getDiv(_);
        $tableDiv.addClass(EMPTY_DATA_CLASS_NAME);
        getTbody(_).html(`<tr ${EMPTY_TPL_KEY}="${_}" style="height: ${$tableDiv.height() - 1 + PX}"><td colspan="${getVisibleTh(_).length}"></td></tr>`);
        const emptyTd = getEmpty(_).get(0).querySelector('td');

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
    async createDOM($table: JTool, settings: SettingObj): Promise<any> {
        const { _ } = settings;

        // 创建DOM前 先清空框架解析列表
        clearCompileList(_);

        coreDOM.init($table, settings);

        setSettings(settings);

        // 等待容器可用
        await this.waitContainerAvailable(_);

        // 重绘thead
        coreDOM.redrawThead(settings);

        // 初始化滚轴
        scroll.init(_);

        // 解析框架: thead区域
        await sendCompile(settings);
    }

    /**
     * 等待容器可用: 防止因容器的宽度不可用，而导致的列宽出错
     * @param _
     */
    waitContainerAvailable(_: string): Promise<void> {
        const tableWrap = rootDocument.querySelector(`[${WRAP_KEY}="${_}"]`);
        function isAvailable() {
            return getStyle(tableWrap, 'width') !== '100%';
        }
        if (isAvailable()) {
            return;
        }
        return new Promise(resolve => {
            SIV_waitContainerAvailable[_] = setInterval(() => {
                if (isAvailable()) {
                    clearInterval(SIV_waitContainerAvailable[_]);
                    SIV_waitContainerAvailable[_] = null;
                    resolve();
                }
            }, 50);
        });
    }
}
export { coreDOM };
export default new Core();
