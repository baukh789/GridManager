/*
 * config: th配置
 * */
import { jTool, base, cache, parseTpl } from '../../common';
import adjust from '../adjust';
import checkbox from '../checkbox';
import scroll from '../scroll';
import configTpl from './config.tpl.html';
import configColumnTpl from './config-column.tpl.html';

class Config {
    /**
     * 初始化配置列[隐藏展示列]
     * @param $table
     */
    init($table) {
        const _this = this;
        // GM容器
        const tableWarp = $table.closest('div.table-wrap');
        const configArea = tableWarp.find('.config-area');

        // 关闭设置事件源
        const configAction = jTool('.config-action', configArea);

        // 事件: 关闭
        configAction.unbind('click');
        configAction.bind('click', function () {
            // 展示事件源
            const _configAction = jTool(this);

            const $tableWrap = _configAction.closest('.table-wrap');
            const $table = base.getTable($tableWrap);
            _this.hide($table);
        });

        // 事件: 设置
        configArea.off('click', '.config-list li');
        configArea.on('click', '.config-list li', function (e) {
            e.preventDefault();

            // 单个的设置项
            const _only = jTool(this);

            // 最后一项显示列不允许隐藏
            if (_only.hasClass('no-click')) {
                return false;
            }

            const checkbox = _only.find('.gm-checkbox');

            // 单个设置项的thName
            const _thName = _only.attr('th-name');

            // 事件下的checkbox
            const _checkbox = _only.find('input[type="checkbox"]');

            // 所在的大容器
            const _tableWarp = _only.closest('.table-wrap');

            // 所在的table-div
            const _tableDiv	= jTool('.table-div', _tableWarp);

            // 所对应的table
            const _$table = base.getTable(_tableWarp);

            const settings = cache.getSettings(_$table);

            // 所对应的th fackTh
            const _th = base.getTh(_$table, _thName);
            const _fakeTh = base.getFakeTh(_$table, _thName);

            _only.closest('.config-list').find('.no-click').removeClass('no-click');
            let isVisible = !_checkbox.prop('checked');

            isVisible ? checkbox.addClass('gm-checkbox-checked') : checkbox.removeClass('gm-checkbox-checked');

            // 设置与当前td同列的td是否可见
            _tableDiv.addClass('config-editing');
            base.setAreVisible([_th, _fakeTh], isVisible, () => {
                _tableDiv.removeClass('config-editing');
            });

            // 更新存储信息
            cache.update(_$table, settings);

            // 当前处于选中状态的展示项
            const _checkedList = jTool('.config-area .checked-li', _tableWarp);

            // 限制最少显示一列
            if (_checkedList.length === 1) {
                _checkedList.addClass('no-click');
            }

            // 重置调整宽度事件源
            if (settings.supportAdjust) {
                adjust.resetAdjust(_$table);
            }

            // 重置镜像滚动条的宽度
            jTool('.sa-inner', _tableWarp).width('100%');

            // 重置当前可视th的宽度
            base.updateThWidth(_$table, settings);

            // 更新存储信息
            cache.update(_$table, settings);

            // 处理置顶表头
            scroll.update(_$table);

            // 更新最后一项可视列的标识
            base.updateVisibleLast($table);

            // 更新滚动轴显示状态
            base.updateScrollStatus(_$table);
        });
    }

	/**
	 * 表格配置区域HTML
     * @param params{configInfo}
	 * @returns {parseData}
     */
	@parseTpl(configTpl)
	createHtml(params) {
	    return {
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
        const { $table, key, isShow } = params;

        // 注意: 这里重新获取一遍th-text，是由于col存储的可能是未通过框架解析的框架模板
        const label = base.getTh($table, key).find('.th-text').text();
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
	 * @param $table
	 * @returns {boolean}
	 */
	toggle($table) {
		// 设置区域
		const $configArea = jTool('.config-area', $table.closest('.table-wrap'));
        const settings = cache.getSettings($table);

        $configArea.css('display') === 'block' ?  this.hide($table) : this.show($table, settings);
	}

    /**
     * 显示配置区域
     * @param $table
     * @param settings
     */
	show($table, settings) {
        const $tableWrap = $table.closest('.table-wrap');
        const $configArea = jTool('.config-area', $tableWrap);

        this.updateConfigList($table, settings);
        $configArea.show();
        this.updateConfigListHeight($table);
    }

    /**
     * 隐藏配置区域
     * @param $table
     */
    hide($table) {
        const $tableWrap = $table.closest('.table-wrap');
        const $configArea = jTool('.config-area', $tableWrap);
        $configArea.hide();
    }

    /**
     * 更新配置区域列表
     * @param $table
     * @param settings
     */
    updateConfigList($table, settings) {
        const $tableWrap = $table.closest('.table-wrap');
        const $configArea = jTool('.config-area', $tableWrap);
        const $configList = jTool('.config-list', $tableWrap);

        // 可视列计数
        let showNum = 0;

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
            $configList.append(this.createColumn({ $table, key, isShow }));
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
     * @param $table
     */
    updateConfigListHeight($table) {
        const $tableWrap = $table.closest('.table-wrap');
        const $configArea = jTool('.config-area', $tableWrap);
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
	 * @param $table
	 */
	destroy($table) {
		const tableWarp = $table.closest('div.table-wrap');
		const configAction = jTool('.config-action', tableWarp);

		// 清理: 配置列表事件 - 打开或关闭
		configAction.unbind('click');

		// 清理: 配置列表事件 - 配置
		jTool('.config-list li', tableWarp).unbind('click');
	}
}
export default new Config();
