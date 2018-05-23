/*
 * Config: th配置
 * */
import { jTool, Base } from './Base';
import Cache from './Cache';
import Adjust from './Adjust';
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

            const settings = Cache.getSettings(_$table);

			// 所对应的th
			const _th = jTool(`thead[grid-manager-thead] th[th-name="${_thName}"]`, _$table);

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
			const _visibleTh = jTool('thead[grid-manager-thead] th[th-visible="visible"]', _$table);
			jTool.each(_visibleTh, (i, v) => {
				// 特殊处理: GM自动创建的列使终为50px
				if (v.getAttribute('gm-create') === 'true') {
					v.style.width = '50px';
				} else {
					v.style.width = 'auto';
				}
			});

			// 当前th文本所占宽度大于设置的宽度
			// 需要在上一个each执行完后才可以获取到准确的值
			jTool.each(_visibleTh, (i, v) => {
				const _realWidthForThText = Base.getTextWidth(v);
				const	_thWidth = jTool(v).width();
				if (_thWidth < _realWidthForThText) {
					jTool(v).width(_realWidthForThText);
				} else {
					jTool(v).width(_thWidth);
				}
			});

            // 更新存储信息
            Cache.update(_$table, settings);

			// 处理置顶表头
			const topThead = jTool(`thead[${Base.getSetTopAttr()}]`, _$table);
			if (topThead.length === 1) {
				topThead.remove();
				_tableDiv.trigger('scroll');
			}
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
