/*
 * config: th配置
 * */
import './style.less';
import jTool from '@common/jTool';
import base from '@common/base';
import cache from '@common/cache';
import { parseTpl } from '@common/parse';
import { CONFIG_KEY } from '@common/constants';
import adjust from '../adjust';
import checkbox from '../checkbox';
import scroll from '../scroll';
import configTpl from './config.tpl.html';
import configColumnTpl from './config-column.tpl.html';
import getConfigEvent from './event';

class Config {
    eventMap = {};

    /**
     * 初始化配置列[隐藏展示列]
     * @param gridManagerName
     */
    init(gridManagerName) {
        const _this = this;
        const $body = jTool('body');
        this.eventMap[gridManagerName] = getConfigEvent(gridManagerName, this.getQuerySelector(gridManagerName));
        const { closeConfig, liChange } = this.eventMap[gridManagerName];

        // 事件: 关闭
        $body.on(closeConfig.events, closeConfig.selector, function () {
            // 展示事件源
            _this.hide(gridManagerName);
        });

        // 事件: 设置
        $body.on(liChange.events, liChange.selector, function (e) {
            e.preventDefault();

            // 单个的设置项
            const _only = jTool(this);

            // 最后一项显示列不允许隐藏
            if (_only.hasClass('no-click')) {
                return false;
            }

            const $checkbox = _only.find('.gm-checkbox');

            // 单个设置项的thName
            const _thName = _only.attr('th-name');

            // 事件下的checkbox
            const _checkbox = _only.find('input[type="checkbox"]');

            // 配置区域
            const $configArea = _this.getDOM(gridManagerName);

            // 所在的table-div
            const $tableDiv	= base.getDiv(gridManagerName);

            jTool('.config-list .no-click', $configArea).removeClass('no-click');
            let isVisible = !_checkbox.prop('checked');

            isVisible ? $checkbox.addClass(checkbox.checkedClassName) : $checkbox.removeClass(checkbox.checkedClassName);

            // 设置与当前th同列的td可视状态
            $tableDiv.addClass('config-editing');
            base.setAreVisible(gridManagerName, [_thName], isVisible);
            $tableDiv.removeClass('config-editing');

            // 当前处于选中状态的展示项
            const _checkedList = jTool('.checked-li', $configArea);

            // 限制最少显示一列
            if (_checkedList.length === 1) {
                _checkedList.addClass('no-click');
            }

            // 通知相关组件进行更新
            _this.noticeUpdate(gridManagerName);
        });
    }

    /**
     * 获取指定key的menu选择器
     * @param gridManagerName
     * @returns {string}
     */
    getQuerySelector(gridManagerName) {
        return `.config-area[${CONFIG_KEY}="${gridManagerName}"]`;
    }

    /**
     * 获取config 的 jtool对像
     * @param gridManagerName
     */
    getDOM(gridManagerName) {
        return jTool(this.getQuerySelector(gridManagerName));
    }

    /**
     * 对项配置成功后，通知相关组件进行更新
     * @param $table
     */
    noticeUpdate(gridManagerName) {
        // 执行前，先对当前的columnMap进行更新
        const settings = cache.update(gridManagerName);

        // 重置调整宽度事件源
        if (settings.supportAdjust) {
            adjust.resetAdjust(gridManagerName);
        }

        // 重置当前可视th的宽度
        base.updateThWidth(settings);

        // 更新存储信息
        cache.update(gridManagerName);

        // 处理置顶表头
        scroll.update(gridManagerName);

        // 更新最后一项可视列的标识
        base.updateVisibleLast(gridManagerName);

        // 更新滚动轴显示状态
        base.updateScrollStatus(gridManagerName);
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
        const label = base.getTh(gridManagerName, key).find('.th-text').text();
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
        this.getDOM(gridManagerName).css('display') === 'block' ?  this.hide(gridManagerName) : this.show(gridManagerName);
	}

    /**
     * 显示配置区域
     * @param gridManagerName
     */
	show(gridManagerName) {
        const $configArea = this.getDOM(gridManagerName);

        this.updateConfigList(gridManagerName);
        $configArea.show();
        this.updateConfigListHeight(gridManagerName);

        const { closeConfigByBody } = this.eventMap[gridManagerName];
        // 点击空处关闭
        const $body = jTool('body');
        $body.off(closeConfigByBody.events);
        $body.on(closeConfigByBody.events, function (e) {
            const eventSource = jTool(e.target);
            if (eventSource.hasClass('config-area') || eventSource.closest('.config-area').length === 1) {
                return false;
            }
            $configArea.hide();
            $body.off(closeConfigByBody.events);
        });
    }

    /**
     * 隐藏配置区域
     * @param gridManagerName
     */
    hide(gridManagerName) {
        const $configArea = this.getDOM(gridManagerName);
        $configArea.hide();
    }

    /**
     * 更新配置区域列表
     * @param gridManagerName
     */
    updateConfigList(gridManagerName) {
        const $configArea = this.getDOM(gridManagerName);
        const $configList = jTool('.config-list', $configArea);

        // 可视列计数
        let showNum = 0;

        const settings = cache.getSettings(gridManagerName);
        const columnList = [];
        jTool.each(settings.columnMap, (key, col) => {
            columnList[col.index] = col;
        });

        // 重置列的可视操作
        $configList.html('');
        jTool.each(columnList, (index, col) => {
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
        showNum === 1 ? checkedLi.addClass('no-click') : checkedLi.removeClass('no-click');
    }

    /**
     * 更新配置列表区的高度: 用于解决 config-list 无法继承 config-area 设置的 max-height问题
     * @param gridManagerName
     */
    updateConfigListHeight(gridManagerName) {
        const $tableWrap = base.getWrap(gridManagerName);
        const $configArea = this.getDOM(gridManagerName);
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
        base.clearBodyEvent(this.eventMap[gridManagerName]);
	}
}
export default new Config();
