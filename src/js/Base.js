/*
 * Base: 基础方法
 * */
import {} from '../../node_modules/jTool/jTool.min';
let $ = window.jTool;
let jTool = window.jTool;
class BaseClass {
	/**
	 * 获取表的GM 唯一标识
	 * @param $table
	 * @returns {*|string}
	 */
	getKey($table) {
		return $table.attr('grid-manager') || '';
	}

	/**
	 * 获取表头吸顶所使用的attr
	 * @returns {string}
     */
	getSetTopAttr() {
		return 'grid-manager-mock-thead';
	}

	/**
	 * 获取数据为空时的html
	 * @param visibleNum: 可视状态TH的数据
	 * @param emptyTemplate: 自定义的为空显示模版
	 * @returns {string}
     */
	getEmptyHtml(visibleNum, emptyTemplate) {
		return `<tr emptyTemplate>
					<td colspan="${visibleNum || 1}">
					${emptyTemplate || ''}
					</td>
				</tr>`;
	}

	/**
	 * 更新数据为空显示DOM所占的列数
	 * @param $table
     */
	updateEmptyCol($table) {
		const emptyDOM = jTool('tr[emptyTemplate]', $table);
		if (emptyDOM.length === 0) {
			return;
		}
		jTool('td', emptyDOM).attr('colspan', jTool('th[th-visible="visible"]', $table).length);
	}

	/**
	 * 输出日志
	 * @param msg 输出文本
	 * @param type 输出分类[info,warn,error]
	 * @returns {*}
     */
	outLog(msg, type) {
		switch (type) {
			case 'info':
				console.info('GridManager Info: ', msg);
				break;
			case 'warn':
				console.warn('GridManager Warn: ', msg);
				break;
			case 'error':
				console.error('GridManager Error: ', msg);
				break;
			default:
				console.log('GridManager: ', msg);
				break;
		}
	}

	/**
	 * 获取同列的 td jTool 对象
	 * @param $dom: $th 或 $td
	 * @returns {*|HTMLElement|jTool}
     */
	getColTd($dom) {
		const $table = $dom.closest('table[grid-manager]');
		const domIndex = $dom.index();
		const trList = $('tbody tr', $table);
		let tdList = [];
		let _td = null;

		$.each(trList, (i, v) => {
			_td = $('td', v).get(domIndex);
			if (_td) {
				tdList.push(_td);
			}
		});
		return $(tdList);
	}

	/**
	 * 根据参数设置列是否可见(th 和 td)
	 * @param $thList 即将配置的列所对应的th[jTool object，可以是多个]
	 * @param isVisible 是否可见
     * @param cb
     */
	setAreVisible($thList, isVisible, cb) {
		// 当前所在的table
		let $table = null;

		// 当前所在的容器
		let	_tableWarp;

		// 当前操作的th
		let	_th = null;

		// 当前tbody下所有的tr
		let	_trList = null;

		// 所对应的td
		let	_tdList = [];

		// 所对应的显示隐藏所在的li
		let	_checkLi = null;

		// 所对应的显示隐藏事件
		let	_checkbox = null;
		$.each($thList, (i, v) => {
			_th = $(v);
			$table = _th.closest('table');
			_tableWarp = $table.closest('.table-wrap');
			_trList = $('tbody tr[cache-key]', $table);
			_checkLi = $(`.config-area li[th-name="${_th.attr('th-name')}"]`, _tableWarp);
			_checkbox = jTool('input[type="checkbox"]', _checkLi);

			$.each(_trList, (i2, v2) => {
				_tdList.push($(v2).find('td').get(_th.index()));
			});

			// 显示
			if (isVisible) {
				_th.attr('th-visible', 'visible');
				$.each(_tdList, (i2, v2) => {
					// $(v2).show();
					v2.setAttribute('td-visible', 'visible');
				});
				_checkLi.addClass('checked-li');
				_checkbox.prop('checked', true);
			} else {
				// 隐藏
				_th.attr('th-visible', 'none');
				$.each(_tdList, (i2, v2) => {
					// $(v2).hide();
					v2.setAttribute('td-visible', 'none');
				});
				_checkLi.removeClass('checked-li');
				_checkbox.prop('checked', false);
			}
			this.updateEmptyCol($table);
			typeof cb === 'function' ? cb() : '';
		});
	}

	/**
	 * 获取TH中文本的宽度. 该宽度指的是文本所实际占用的宽度
	 * @param th
	 * @returns {*}
     */
	getTextWidth(th) {
		const $th = $(th);

		// th下的GridManager包裹容器
		const thWarp = $('.th-wrap', $th);

		// 文本所在容器
		const thText = $('.th-text', $th);

		// 文本镜象 用于处理实时获取文本长度
		const tableWrap = $th.closest('.table-wrap');
		const textDreamland	= $('.text-dreamland', tableWrap);

		// 将th文本嵌入文本镜象 用于获取文本实时宽度
		textDreamland.text(thText.text());
		textDreamland.css({
			fontSize: thText.css('font-size'),
			fontWeight: thText.css('font-weight'),
			fontFamily: thText.css('font-family')
		});
		const thPaddingLeft = thWarp.css('padding-left');
		const thPaddingRight = thWarp.css('padding-right');
		// 返回宽度值
		// 文本所占宽度 + 左内间距 + 右内间距 + (由于使用 table属性: border-collapse: collapse; 和th: border-right引发的table宽度计算容错) + th-wrap减去的1px
		return textDreamland.width() + (thPaddingLeft || 0) + (thPaddingRight || 0) + 2 + 1;
	}

	/**
	 * 显示加载中动画
	 * @param dom[jTool] 加载动画的容器
	 * @param cb 回调函数
     */
	showLoading(dom, cb) {
		if (!dom || dom.length === 0) {
			return false;
		}
		const loading = dom.find('.load-area');
		if (loading.length > 0) {
			loading.remove();
		}
		const loadingDom = $(`<div class="load-area loading"><div class="loadInner kernel"></div></div>`);
		dom.append(loadingDom);

		// 进行loading图标居中显示
		const loadInner = jTool('.load-area .loadInner', dom);
		const domHeight = dom.height();
		const loadInnerHeight = loadInner.height();
		loadInner.css('margin-top', (domHeight - loadInnerHeight) / 2);
		window.setTimeout(() => {
			typeof cb === 'function' ? cb() : '';
		}, 100);

		return true;
	}

	/**
	 * 隐藏加载中动画
	 * @param dom
	 * @param cb
     */
	hideLoading(dom, cb) {
		if (!dom || dom.length === 0) {
			return false;
		}
		window.setTimeout(() => {
			$('.load-area', dom).remove();
			typeof cb === 'function' ? cb() : '';
		}, 500);
		return true;
	}

	/**
	 * 更新当前用户交互状态, 用于优化置顶状态下进行[拖拽, 宽度调整]操作时,页面出现滚动的问题
	 * @param $table
	 * @param interactive: 如果不存在于interactiveList内, 将删除属性[user-interactive]
	 */
	updateInteractive($table, interactive) {
		const interactiveList = ['Adjust', 'Drag'];
		// 事件源所在的容器
		let	tableWrap = $table.closest('.table-wrap');
		if (!interactive || interactiveList.indexOf(interactive) === -1) {
			tableWrap.removeAttr('user-interactive');
		} else {
			tableWrap.attr('user-interactive', interactive);
		}
	}

	/**
	 * 更新滚动轴显示状态
	 * @param $table
	 */
	updateScrollStatus($table) {
		const $tableDiv = $table.closest('.table-div');
		// 宽度: table === tableDiv 隐藏横向滚动轴. 反之 显示
		if ($table.width() === $tableDiv.width()) {
			$tableDiv.css('overflow-x', 'hidden');
			return 'hidden';
		} else {
			$tableDiv.css('overflow-x', 'auto');
			return 'auto';
		}
	}

	/**
	 * 通过配置项columnData 获取指定列的可视信息
	 * @param col 列的配置信息
	 * @returns {string}
     */
	getVisibleForColumn(col) {
		return col.isShow ? 'visible' : 'none';
	}

    /**
     * 执行字符串形式的方法
     * @param strFnBody
     */
	runStr(strFnBody, row) {
        // fun = Function 是未了规避 报Function调用eval的错误
        const fun = Function;
        // 'row': 实例化函数时指定参数, str + '(row)': 函数体，并指定形参， (row): 实参
        // 等同于 (function(row){eval('str(row)')})(row)
        new fun('row', `${strFnBody}(row)`)(row);
    }
}
const Base = new BaseClass();
export {jTool, $, Base};
