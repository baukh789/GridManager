/*
 * config: th配置
 * */
import './style.less';
import jTool from '@common/jTool';
import { getDiv, updateThWidth, setAreVisible, updateVisibleLast, updateScrollStatus, getTh, getWrap, clearTargetEvent } from '@common/base';
import { updateCache, getSettings } from '@common/cache';
import { parseTpl } from '@common/parse';
import { jEach } from '@common/utils';
import { CONFIG_KEY, CHECKED_CLASS, TH_NAME } from '@common/constants';
import adjust from '../adjust';
import checkbox from '../checkbox';
import scroll from '../scroll';
import configTpl from './config.tpl.html';
import configColumnTpl from './config-column.tpl.html';
import { getEvent, eventMap } from './event';
import { CLASS_CONFIG, CLASS_CONFIG_ING, CLASS_NO_CLICK } from './constants';

/**
 * 获取config 的 jtool对像
 * @param gridManagerName
 */
const getDOM = gridManagerName => {
    return jTool(`[${CONFIG_KEY}="${gridManagerName}"]`);
};

class Config {

    /**
     * 初始化配置列[隐藏展示列]
     * @param gridManagerName
     */
    init(gridManagerName) {
        const _this = this;
        eventMap[gridManagerName] = getEvent(gridManagerName);
        const { closeConfig, liChange } = eventMap[gridManagerName];

        // 事件: 关闭
        jTool(closeConfig.target).on(closeConfig.events, closeConfig.selector, function () {
            // 展示事件源
            _this.hide(gridManagerName);
        });

        // 事件: 设置
        jTool(liChange.target).on(liChange.events, liChange.selector, function (e) {
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
            const $configArea = getDOM(gridManagerName);

            // 所在的table-div
            const $tableDiv	= getDiv(gridManagerName);

            jTool(`.config-list .${CLASS_NO_CLICK}`, $configArea).removeClass(CLASS_NO_CLICK);

            // 取反事件下的checkbox的checked
            let isVisible = !_only.find('input[type="checkbox"]').prop('checked');

            isVisible ? $checkbox.addClass(CHECKED_CLASS) : $checkbox.removeClass(CHECKED_CLASS);

            // 设置与当前th同列的td可视状态
            $tableDiv.addClass(CLASS_CONFIG_ING);
            setAreVisible(gridManagerName, [_thName], isVisible);
            $tableDiv.removeClass(CLASS_CONFIG_ING);

            // 当前处于选中状态的展示项
            const _checkedList = jTool('.checked-li', $configArea);

            // 限制最少显示一列
            if (_checkedList.length === 1) {
                _checkedList.addClass(CLASS_NO_CLICK);
            }

            // 通知相关组件进行更新
            _this.noticeUpdate(gridManagerName);
        });
    }

    /**
     * 对项配置成功后，通知相关组件进行更新
     * @param $table
     */
    noticeUpdate(gridManagerName) {
        // 执行前，先对当前的columnMap进行更新
        const settings = updateCache(gridManagerName);

        // 重置调整宽度事件源
        if (settings.supportAdjust) {
            adjust.resetAdjust(gridManagerName);
        }

        // 重置当前可视th的宽度
        updateThWidth(settings);

        // 更新存储信息
        updateCache(gridManagerName);

        // 处理置顶表头
        scroll.update(gridManagerName);

        // 更新最后一项可视列的标识
        updateVisibleLast(gridManagerName);

        // 更新滚动轴显示状态
        updateScrollStatus(gridManagerName);
    }

	/**
	 * 表格配置区域HTML
     * @param params{configInfo}
	 * @returns {parseData}
     */
	@parseTpl(configTpl)
	createHtml(params) {
	    return {
	        configKey: CONFIG_KEY,
            gridManagerName: params.gridManagerName,
            configInfo: params.configInfo
	    };
	}

    /**
     * 生成配置列HTML
     * @param params{key, key, isShow}
     * @returns {string}
     */
    @parseTpl(configColumnTpl)
    createColumn(params) {
        const { gridManagerName, key, isShow } = params;

        // 注意: 这里重新获取一遍th-text，是由于col存储的可能是未通过框架解析的框架模板
        const label = getTh(gridManagerName, key).find('.th-text').text();
        const checkboxTpl = checkbox.getCheckboxTpl({checked: isShow, label});
	    return {
            key,
            label,
            isShow,
            checkboxTpl
        };
    }

	/**
	 * 切换配置区域可视状态
	 * @param gridManagerName
	 * @returns {boolean}
	 */
	toggle(gridManagerName) {
        getDOM(gridManagerName).css('display') === 'block' ?  this.hide(gridManagerName) : this.show(gridManagerName);
	}

    /**
     * 显示配置区域
     * @param gridManagerName
     */
	show(gridManagerName) {
        const $configArea = getDOM(gridManagerName);

        this.updateConfigList(gridManagerName);
        $configArea.show();
        this.updateConfigListHeight(gridManagerName);

        const { target, events } = eventMap[gridManagerName].closeConfigByBody;
        // 点击空处关闭
        const $target = jTool(target);
        $target.off(events);
        $target.on(events, function (e) {
            const eventSource = jTool(e.target);
            if (eventSource.hasClass(CLASS_CONFIG) || eventSource.closest(`.${CLASS_CONFIG}`).length === 1) {
                return false;
            }
            $configArea.hide();
            $target.off(events);
        });
    }

    /**
     * 隐藏配置区域
     * @param gridManagerName
     */
    hide(gridManagerName) {
        getDOM(gridManagerName).hide();
    }

    /**
     * 更新配置区域列表
     * @param gridManagerName
     */
    updateConfigList(gridManagerName) {
        const $configArea = getDOM(gridManagerName);
        const $configList = jTool('.config-list', $configArea);

        // 可视列计数
        let showNum = 0;

        const settings = getSettings(gridManagerName);
        const columnList = [];
        jEach(settings.columnMap, (key, col) => {
            columnList[col.index] = col;
        });

        // 重置列的可视操作
        $configList.html('');
        jEach(columnList, (index, col) => {
            let {key, isShow, disableCustomize} = col;
            if (disableCustomize) {
                return;
            }
            $configList.append(this.createColumn({ gridManagerName, key, isShow }));
            if (isShow) {
                showNum++;
            }
        });

        // 验证当前是否只有一列处于显示状态, 如果是则禁止取消显示
        const checkedLi = jTool('.checked-li', $configArea);
        showNum === 1 ? checkedLi.addClass(CLASS_NO_CLICK) : checkedLi.removeClass(CLASS_NO_CLICK);
    }

    /**
     * 更新配置列表区的高度: 用于解决 config-list 无法继承 gm-config-area 设置的 max-height问题
     * @param gridManagerName
     */
    updateConfigListHeight(gridManagerName) {
        const $tableWrap = getWrap(gridManagerName);
        const $configArea = getDOM(gridManagerName);
        const configList = $configArea.find('.config-list').get(0);
        const $configInfo = $configArea.find('.config-info');
        setTimeout(() => {
            $configArea.css('visibility', 'hidden');
            configList.style.maxHeight = (($tableWrap.height() - 90 - 20 - $configInfo.height()) || 0) + 'px';
            $configArea.css('visibility', 'inherit');
        });
    }

    /**
	 * 消毁
	 * @param gridManagerName
	 */
	destroy(gridManagerName) {
        // 清除事件
        clearTargetEvent(eventMap[gridManagerName]);
	}
}
export default new Config();
