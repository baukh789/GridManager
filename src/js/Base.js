/*
 * Base: 基础方法
 * */
import {} from '../../node_modules/jtool/jTool.min';
import { ORDER_WIDTH, CHECKBOX_WIDTH, CONSOLE_STYLE } from '../common/constants';
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
			    console.log(`%c GridManager Info %c ${msg} `, ...CONSOLE_STYLE.INFO);
                break;
			case 'warn':
                console.log(`%c GridManager Warn %c ${msg} `, ...CONSOLE_STYLE.WARN);
				break;
			case 'error':
			    console.log(`%c GridManager Error %c ${msg} `, ...CONSOLE_STYLE.ERROR);
                break;
			default:
                console.log(`%c GridManager Log %c ${msg} `, ...CONSOLE_STYLE.INFO);
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
					v2.setAttribute('td-visible', 'visible');
				});
				_checkLi.addClass('checked-li');
				_checkbox.prop('checked', true);
			} else {
				// 隐藏
				_th.attr('th-visible', 'none');
				$.each(_tdList, (i2, v2) => {
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
     * 更新列宽
     * @param $table
     */
	updateThWidth($table, settings) {
        const $tableDiv = $table.closest('.table-div');
        const $thead = jTool('thead[grid-manager-thead]', $table);
        const $visibleThList = jTool('th[th-visible="visible"]', $thead);
        jTool.each($visibleThList, (i, v) => {
            // 全选列
            if (v.getAttribute('gm-checkbox') === 'true') {
                v.style.width = CHECKBOX_WIDTH;
                return;
            }

            // 序号列
            if (v.getAttribute('gm-order') === 'true') {
                v.style.width = ORDER_WIDTH;
                return;
            }

            // 禁止配置的列
            if (settings.columnMap[v.getAttribute('th-name')].disableCustomize) {
                v.style.width = settings.columnMap[v.getAttribute('th-name')].__width;
                return;
            }
            v.style.width = 'auto';
        });

        // 当前th文本所占宽度大于设置的宽度
        // 需要在上一个each执行完后,才可以获取到准确的值
        let widthTotal = 0;
        let minWidth = null;
        let thWidth = null;
        let newWidth = null;
        jTool.each($visibleThList, (i, v) => {
            thWidth = jTool(v).width();
            minWidth = Base.getTextWidth(v);
            newWidth = thWidth < minWidth ? minWidth : thWidth;
            // 最后一列使用剩余的宽度
            if (i === $visibleThList.length - 1) {
                newWidth = $tableDiv.width() > widthTotal + newWidth ? $tableDiv.width() - widthTotal : newWidth;
            }

            jTool(v).width(newWidth);
            widthTotal += newWidth;
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
	 * @param loadingTemplate 加载动画模板
	 * @param cb 回调函数
     */
	showLoading(dom, loadingTemplate, cb) {
		if (!dom || dom.length === 0) {
			return false;
		}
		const loading = dom.find('.gm-load-area');
		if (loading.length > 0) {
			loading.remove();
		}
		const loadingDom = $(loadingTemplate || `<div class="loading"><div class="loadInner kernel"></div></div>`);
        loadingDom.addClass('gm-load-area');
		dom.append(loadingDom);
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
			$('.gm-load-area', dom).remove();
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
		// 宽度: table的宽度大于 tableDiv的宽度时，显示滚动条
		if ($table.width() > $tableDiv.width()) {
            $tableDiv.css('overflow-x', 'auto');
            return 'auto';
		} else {
            $tableDiv.css('overflow-x', 'hidden');
            return 'hidden';
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
	 * clone 对象, 对 JSON.stringify 存在丢失情为的类型(如function)不作处理。因为GM中不存在这种情况
	 * @param object
	 * @returns {any}
	 */
	cloneObject(object) {
		return JSON.parse(JSON.stringify(object));
	}

    /**
     * 根据不同的框架解析指定节点
     * @param settings:
     * @param compileList: 将要解析的节点
     * @returns {boolean}
     */
    compileFramework(settings, compileList) {
        try {
            // 解析框架: Vue
            if (typeof settings.compileVue === 'function' && compileList.length > 0) {
                settings.compileVue(compileList);
            }

            // 解析框架: Angular 1.x
            if (typeof settings.compileAngularjs === 'function' && compileList.length > 0) {
                settings.compileAngularjs(compileList);
            }

            // 解析框架: React
            // ...
            return true;
        } catch (e) {
            this.outLog(`框架模板解析异常。详细原因:\\n${e}`, 'error');
            return false;
        }
    }

    /**
     * 计算表格布局
     * @param $table
     * @param width
     * @param height
     * @param supportAjaxPage
     */
    calcLayout($table, width = '100%', height = '100%', supportAjaxPage = true) {
        const tableWrap = $table.closest('.table-wrap').get(0);
        const tableDiv = tableWrap.querySelector('.table-div');
        tableWrap.style.width = `calc(${width})`;
        tableWrap.style.height = `calc(${height})`;
        tableDiv.style.height = `calc(100% - ${supportAjaxPage ? '40px' : '0px'})`;
    }

    /**
     * 获取单选框
     * @param checked: 是否选中
     * @param label: 复选框文本
     * @param value: input value
     * @returns {string}
     */
    getRadioString(checked, label, value) {
        return `<label class="gm-radio-wrapper">
                    <span class="gm-radio-checkbox gm-radio${checked ? ' gm-radio-checked' : ''}">
                        <input type="radio" class="gm-radio-checkbox-input gm-radio-input"${value ? ' value="' + value + '"' : ''}${checked ? ' checked="true"' : ''}/>
                        <span class="gm-radio-inner"></span>
                    </span>
                    ${label ? '<span>' + label + '</span>' : ''}
                </label>`;
    }

    /**
     * 更新单选框状态
     * @param $radio
     * @param state Boolean
     */
    updateRadioState($radio, state) {
        const $input = jTool(`input[type="radio"]`, $radio);
        if (state) {
            $radio.addClass('gm-radio-checked');
        } else {
            $radio.removeClass('gm-radio-checked');
        }
        $input.prop('checked', state);
    }

    /**
     * 获取复选框
     * @param state: [checked: 选中, indeterminate: 半选中, unchecked: 未选中]
     * @param label: 复选框文本
     * @param value: input value
     * @returns {string}
     */
    getCheckboxString(state, label, value) {
        // 选中 gm-checkbox-checked
        // 半选 gm-checkbox-indeterminate
        let stateStr = '';
        switch (state) {
            // 选中状态
            case 'checked':
                stateStr = 'gm-checkbox-checked';
                break;
            // 半选中
            case 'indeterminate':
                stateStr = 'gm-checkbox-indeterminate';
                break;
            // 未选中
            case 'unchecked':
                stateStr = '';
                break;
            default:
                stateStr = '';
                break;
        }
        return `<label class="gm-checkbox-wrapper">
                    <span class="gm-radio-checkbox gm-checkbox ${stateStr}">
                        <input type="checkbox" class="gm-radio-checkbox-input gm-checkbox-input"${value ? ' value="' + value + '"' : ''}${state === 'checked' ? ' checked="true"' : ''}/>
                        <span class="gm-checkbox-inner"></span>
                    </span>
                    ${label ? '<span>' + label + '</span>' : ''}
                </label>`;
    }

    /**
     * 更新checkbox选中状态
     * @param $checkbox: '<span class="gm-checkbox"></span>'
     * @param state: [checked: 选中, indeterminate: 半选中, uncheck: 未选中]
     */
    updateCheckboxState($checkbox, state) {
        const $input = jTool(`input[type="checkbox"]`, $checkbox);
        switch (state) {
            case 'checked': {
                $checkbox.addClass('gm-checkbox-checked');
                $checkbox.removeClass('gm-checkbox-indeterminate');
                $input.prop('checked', true);
                break;
            }
            case 'indeterminate': {
                $checkbox.removeClass('gm-checkbox-checked');
                $checkbox.addClass('gm-checkbox-indeterminate');
                $input.prop('checked', false);
                break;
            }
            case 'unchecked': {
                $checkbox.removeClass('gm-checkbox-checked');
                $checkbox.removeClass('gm-checkbox-indeterminate');
                $input.prop('checked', false);
                break;
            }
        }
    }

}
const Base = new BaseClass();
export {jTool, $, Base};
