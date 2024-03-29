/*
 * config: th配置
 * */
import './style.less';
import jTool from '@jTool';
import { each } from '@jTool/utils';
import { getDiv, updateThWidth, setAreVisible, updateVisibleLast, updateScrollStatus, getFakeTh, getWrap, clearTargetEvent, updateFakeThead } from '@common/base';
import { updateCache, getSettings } from '@common/cache';
import { parseTpl } from '@common/parse';
import { CONFIG_KEY, CHECKED_CLASS, TH_NAME, CHECKED, DISABLE_CUSTOMIZE, PX } from '@common/constants';
import checkbox from '../checkbox';
import fixed from '../fixed';
import configTpl from './config.tpl.html';
import { getEvent, eventMap } from './event';
import { CLASS_CONFIG, CLASS_CONFIG_ING, CLASS_NO_CLICK } from './constants';
import { EVENTS, TARGET, SELECTOR } from '@common/events';
import { JTool, Column, ConfigHtmlParams, ColHtmlParams } from 'typings/types';

/**
 * 获取config 的 jtool对像
 * @param _
 */
const getDOM = (_: string): JTool => {
    return jTool(`[${CONFIG_KEY}="${_}"]`);
};

/**
 * 更新配置列表区的高度: 用于解决 config-list 无法继承 gm-config-area 设置的 max-height问题
 * @param _
 */
export const updateConfigListHeight = (_: string): void => {
    const $tableWrap = getWrap(_);
    const $configArea = getDOM(_);
    const configList = $configArea.find('.config-list').get(0);
    const $configInfo = $configArea.find('.config-info');
    $configArea.css('visibility', 'hidden');
    setTimeout(() => {
        configList.style.maxHeight = (($tableWrap.height() - 90 - 20 - $configInfo.height()) || 0) + PX;
        $configArea.css('visibility', 'inherit');
    });
};


class Config {

    /**
     * 初始化配置列[隐藏展示列]
     * @param _
     */
    init(_: string): void {
        const _this = this;
        eventMap[_] = getEvent(_);
        const { closeConfig, liChange } = eventMap[_];

        // 事件: 关闭
        jTool(closeConfig[TARGET]).on(closeConfig[EVENTS], closeConfig[SELECTOR], function () {
            // 展示事件源
            _this.hide(_);
        });

        // 事件: 设置
        jTool(liChange[TARGET]).on(liChange[EVENTS], liChange[SELECTOR], function (e: MouseEvent) {
            e.preventDefault();

            // 单个的设置项
            const _only = jTool(this);

            // 最后一项显示列不允许隐藏
            if (_only.hasClass(CLASS_NO_CLICK)) {
                return false;
            }

            const $checkbox = _only.find('.gm-checkbox');

            // 单个设置项的thName
            const _thName = _only.attr(TH_NAME);

            // 配置区域
            const $configArea = getDOM(_);

            // 所在的table-div
            const $tableDiv	= getDiv(_);

            jTool(`.config-list .${CLASS_NO_CLICK}`, $configArea).removeClass(CLASS_NO_CLICK);

            // 取反事件下的checkbox的checked
            let isVisible = !_only.find('input[type="checkbox"]').prop(CHECKED);

            isVisible ? $checkbox.addClass(CHECKED_CLASS) : $checkbox.removeClass(CHECKED_CLASS);

            // 设置与当前th同列的td可视状态
            $tableDiv.addClass(CLASS_CONFIG_ING);
            setAreVisible(_, _thName, isVisible);
            $tableDiv.removeClass(CLASS_CONFIG_ING);

            // 当前处于选中状态的展示项
            const _checkedList = jTool('.checked-li', $configArea);

            // 限制最少显示一列
            if (_checkedList.length === 1) {
                _checkedList.addClass(CLASS_NO_CLICK);
            }

            // 通知相关组件进行更新
            _this.update(_);
        });
    }

    /**
     * 更新配置区域列表
     * @param _
     */
    updateConfigList(_: string): void {
        const $configArea = getDOM(_);
        const $configList = jTool('.config-list', $configArea);

        // 可视列计数
        let showNum = 0;

        const columnList: Array<Column> = [];
        each(getSettings(_).columnMap, (key: string, col: Column) => {
            columnList[col.index] = col;
        });

        // 重置列的可视操作
        $configList.html('');
        each(columnList, (col: Column) => {
            const { key, isShow } = col;
            if (col[DISABLE_CUSTOMIZE]) {
                return;
            }
            // 注意: 这里重新获取一遍th-text，是由于col存储的可能是未通过框架解析的框架模板
            const label = getFakeTh(_, key).find('.th-text').text();
            $configList.append(this.createColumn({ key, isShow, label }));
			if (isShow) {
                showNum++;
            }
        });

        // 验证当前是否只有一列处于显示状态, 如果是则禁止取消显示
        const checkedLi = jTool('.checked-li', $configArea);
        showNum === 1 ? checkedLi.addClass(CLASS_NO_CLICK) : checkedLi.removeClass(CLASS_NO_CLICK);
    }

    /**
     * 对项配置成功后，通知相关组件进行更新
     * @param _
     */
    update(_: string): void {
        // 执行前，先对当前的columnMap进行更新
        let settings = updateCache(_);
        getDiv(_).scrollLeft(0);

        // 重置当前可视th的宽度
        updateThWidth(settings);

        // 更新存储信息
        settings = updateCache(_);

        // 处理置顶表头
        updateFakeThead(settings);
        fixed.update(_);

        // 更新最后一项可视列的标识
        updateVisibleLast(_);

        // 更新滚动轴显示状态
        updateScrollStatus(_);

        fixed.resetFlag(_);
    }

	/**
	 * 表格配置区域HTML
     * @param params{configInfo}
	 * @returns {}
     */
	@parseTpl(configTpl)
	createHtml(params: ConfigHtmlParams): string {
		// @ts-ignore
	    return {
	        key: `${CONFIG_KEY}="${params._}"`,
            info: params.configInfo
	    };
	}

    /**
     * 生成配置列HTML
     * @param params{key, key, isShow}
     * @returns {string}
     */
    createColumn(params: ColHtmlParams): string {
        const { key, isShow, label } = params;
		const checkboxTpl = checkbox.getCheckboxTpl({checked: isShow, label});
        return `<li th-name="${key}"${isShow ? ' class="checked-li"' : ''}>${checkboxTpl}</li>`;
    }

	/**
	 * 切换配置区域可视状态
	 * @param _
	 * @returns {boolean}
	 */
	toggle(_: string): void {
        getDOM(_).css('display') === 'block' ?  this.hide(_) : this.show(_);
	}

    /**
     * 显示配置区域
     * @param _
     */
	show(_: string): void {
        const $configArea = getDOM(_);

        this.updateConfigList(_);
        $configArea.show();
        updateConfigListHeight(_);

        const { closeConfigByBody } = eventMap[_];
        const events = closeConfigByBody[EVENTS];
        // 点击空处关闭
        const $target = jTool(closeConfigByBody[TARGET]);
        $target.off(events);
        $target.on(events, function (e: MouseEvent) {
            const eventSource = jTool(e.target as HTMLElement);
            if (eventSource.hasClass(CLASS_CONFIG) || eventSource.closest(`.${CLASS_CONFIG}`).length === 1) {
                return false;
            }
            $configArea.hide();
            $target.off(events);
        });
    }

    /**
     * 隐藏配置区域
     * @param _
     */
    hide(_: string): void {
        getDOM(_).hide();
    }

    /**
	 * 消毁
	 * @param _
	 */
	destroy(_: string): void {
        // 清除事件
        clearTargetEvent(eventMap[_]);
	}
}
export default new Config();
