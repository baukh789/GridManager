/*
 * Config: th配置
 * */
import { jTool, Base } from './Base';
import Cache from './Cache';
import Adjust from './Adjust';
import Scroll from './Scroll';
class Config {
	/**
	 * 表格配置区域HTML
     * @param settings
	 * @returns {string}
     */
	createHtml(settings) {
		const html = `<div class="config-area">
						<span class="config-action">
							<i class="iconfont icon-close"></i>
						</span>
						<div class="config-info">${settings.configInfo}</div>
						<ul class="config-list"></ul>
					</div>`;
		return html;
	}

    /**
     * 生成配置列HTML
     * @param thName
     * @param content
     * @param isShow
     * @returns {string}
     */
    createColumn(thName, content, isShow) {
	    return `<li th-name="${thName}"${isShow ? 'class="checked-li"' : ''}>
                    <label class="gm-checkbox-wrapper">
                        <span class="gm-radio-checkbox gm-checkbox${isShow ? ' gm-checkbox-checked' : ''}">
                            <input type="checkbox" class="gm-radio-checkbox-input gm-checkbox-input">
                            <span class="gm-checkbox-inner"></span>
                        </span>
                        ${content}
                    </label>
                </li>`;
    }

	/**
	 * 初始化配置列
	 * @param $table
     */
	init($table) {
		this.__bindConfigEvent($table);
	}

	/**
	 * 绑定配置列表事件[隐藏展示列]
	 * @param $table
     */
	__bindConfigEvent($table) {
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
            const $table = $tableWrap.find('table[grid-manager]');
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
			const _$table = jTool('[grid-manager]', _tableWarp);

            const settings = Cache.getSettings(_$table);

			// thead fackThead
			const $thead = jTool('thead[grid-manager-thead]', _$table);
			const $fakeThead = jTool(`thead[${Base.fakeTheadAttr}]`, _$table);

			// 所对应的th fackTh
			const _th = jTool(`th[th-name="${_thName}"]`, $thead);
			const _fakeTh = jTool(`th[th-name="${_thName}"]`, $fakeThead);

			_only.closest('.config-list').find('.no-click').removeClass('no-click');
			let isVisible = !_checkbox.prop('checked');

            isVisible ? checkbox.addClass('gm-checkbox-checked') : checkbox.removeClass('gm-checkbox-checked');

			// 设置与当前td同列的td是否可见
			_tableDiv.addClass('config-editing');
			Base.setAreVisible([_th, _fakeTh], isVisible, () => {
				_tableDiv.removeClass('config-editing');
			});

            // 更新存储信息
            Cache.update(_$table, settings);

			// 当前处于选中状态的展示项
			const _checkedList = jTool('.config-area .checked-li', _tableWarp);

			// 限制最少显示一列
			if (_checkedList.length === 1) {
				_checkedList.addClass('no-click');
			}

			// 重置调整宽度事件源
			if (settings.supportAdjust) {
				Adjust.resetAdjust(_$table);
			}

			// 重置镜像滚动条的宽度
			jTool('.sa-inner', _tableWarp).width('100%');

            // 重置当前可视th的宽度
            Base.updateThWidth(_$table, settings);

            // 更新存储信息
            Cache.update(_$table, settings);

			// 处理置顶表头
            Scroll.update(_$table);

            // 更新最后一项可视列的标识
            Base.updateVisibleLast($table);

            // 更新滚动轴显示状态
            Base.updateScrollStatus(_$table);
		});
	}

	/**
	 * 切换配置区域可视状态
	 * @param $table
	 * @returns {boolean}
	 */
	toggle($table) {
		// 设置区域
		const $configArea = jTool('.config-area', $table.closest('.table-wrap'));
        const settings = Cache.getSettings($table);

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
        const $thead = jTool('thead[grid-manager-thead]', $table);

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

            let onlyText = $thead.find(`th[th-name="${key}"] .th-text`).text();
            $configList.append(this.createColumn(key, onlyText, isShow));
            if (isShow) {
                showNum++;
            }
            $configList.find(`li[th-name="${key}"] input[type="checkbox"]`).prop('checked', isShow);
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
