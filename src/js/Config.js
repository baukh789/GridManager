/*
 * Config: th配置
 * */
import { jTool, Base } from './Base';
import Cache from './Cache';
import Adjust from './Adjust';
import Checkbox from './Checkbox';
import Order from './Order';
import Scroll from './Scroll';
class Config {
	/**
	 * 表格配置区域HTML
	 * @returns {string}
     */
	get html() {
		const html = `<div class="config-area">
						<span class="config-action">
							<i class="iconfont icon-close"></i>
						</span>
						<ul class="config-list"></ul>
					</div>`;
		return html;
	}

    /**
     * 生成配置列HTML
     * @param thName
     * @param content
     * @returns {string}
     */
    createColumn(thName, content) {
	    return `<li th-name="${thName}">
                    <input type="checkbox"/>
                    <label>
                        <span class="fake-checkbox"></span>
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

		// 打开/关闭设置事件源
		const configAction = jTool('.config-action', tableWarp);

		// 事件: 打开 关闭
		configAction.unbind('click');
		configAction.bind('click', function () {
			// 展示事件源
			const _configAction = jTool(this);

			const $tableWrap = _configAction.closest('.table-wrap');
			_this.toggle($tableWrap);
		});

		// 事件: 设置
		jTool('.config-list li', tableWarp).unbind('click');
		jTool('.config-list li', tableWarp).bind('click', function () {
			// 单个的设置项
			const _only = jTool(this);

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

			// thead
			const $thead = jTool('thead[grid-manager-thead]', _$table);

			// 存储原宽度，用于校正重新生成后的宽度
			const theadWidth = $thead.width();

            const settings = Cache.getSettings(_$table);

			// 所对应的th
			const _th = jTool(`th[th-name="${_thName}"]`, $thead);

			// 最后一项显示列不允许隐藏
			if (_only.hasClass('no-click')) {
				return false;
			}
			_only.closest('.config-list').find('.no-click').removeClass('no-click');
			let isVisible = !_checkbox.prop('checked');

			// 设置与当前td同列的td是否可见
			_tableDiv.addClass('config-editing');
			Base.setAreVisible(_th, isVisible, () => {
				_tableDiv.removeClass('config-editing');
			});

			// 当前处于选中状态的展示项
			const _checkedList = jTool('.config-area input[type="checkbox"]:checked', _tableWarp);

			// 限制最少显示一列
			if (_checkedList.length === 1) {
				_checkedList.parent().addClass('no-click');
			}

			// 重置调整宽度事件源
			if (settings.supportAdjust) {
				Adjust.resetAdjust(_$table);
			}

			// 重置镜像滚动条的宽度
			jTool('.sa-inner', _tableWarp).width('100%');

			// 重置当前可视th的宽度
			const _visibleTh = jTool('th[th-visible="visible"]', $thead);

			jTool.each(_visibleTh, (i, v) => {
				// 全选列
				if (v.getAttribute('gm-checkbox') === 'true') {
					v.style.width = Checkbox.width;
                    return;
				}

                // 序号列
				if (v.getAttribute('gm-order') === 'true') {
                    v.style.width = Order.width;
                    return;
                }

                v.style.width = 'auto';
			});

			// 当前th文本所占宽度大于设置的宽度
			// 需要在上一个each执行完后,才可以获取到准确的值
            let widthTotal = 0;
            let _minWidth = null;
            let _thWidth = null;
            let _newWidth = null;
			jTool.each(_visibleTh, (i, v) => {
                _thWidth = jTool(v).width();
				_minWidth = Base.getTextWidth(v);
                _newWidth = _thWidth < _minWidth ? _minWidth : _thWidth;
				// 最后一列使用剩余的宽度
				if (i === _visibleTh.length - 1) {
                    _newWidth = _tableDiv.width() > widthTotal + _newWidth ? _tableDiv.width() - widthTotal : _newWidth;
                }

                jTool(v).width(_newWidth);
                widthTotal += _newWidth;
			});

            // 更新存储信息
            Cache.update(_$table, settings);

			// 处理置顶表头
            Scroll.render(_$table);
            Scroll.update(_$table);
            Base.updateScrollStatus(_$table);
		});
	}

	/**
	 * 切换可视状态
	 * @param $tableWrap
	 * @returns {boolean}
	 */
	toggle($tableWrap) {
		const $table = jTool('table[grid-manager]', $tableWrap);
		const settings = Cache.getSettings($table);

		// 设置区域
		const $configArea = jTool('.config-area', $tableWrap);

		// 关闭配置区域
		if ($configArea.css('display') === 'block') {
			$configArea.hide();
			return false;
		}

		// 选中状态的li
		let checkLi = null;

		// 选中状态的input
		let checkInput = null;

		// 可视列计数
		let showNum = 0;

		// 重置列的可视操作
		jTool.each(settings.columnMap, (key, col) => {
			checkLi = jTool(`li[th-name="${col.key}"]`, $configArea);
			checkInput = jTool('input[type="checkbox"]', checkLi);
			if (col.isShow) {
				checkLi.addClass('checked-li');
				checkInput.prop('checked', true);
				showNum++;
				return;
			}
			checkLi.removeClass('checked-li');
			checkInput.prop('checked', false);
		});

		// 验证当前是否只有一列处于显示状态, 如果是则禁止取消显示
		const checkedLi = jTool('.checked-li', $configArea);
		showNum === 1 ? checkedLi.addClass('no-click') : checkedLi.removeClass('no-click');

		// 打开配置区域
		$configArea.show();
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
