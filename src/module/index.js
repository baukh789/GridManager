/*
 *  GridManager: 入口
 * */
import { jTool, base } from '../common';
import GridManager from './GridManager';
import { PublishMethod, publishMethodArray } from './publish';
/*
*  捆绑至选择器对象
* */
(jTool => {
	Element.prototype.GM = Element.prototype.GridManager = function () {
		// 验证当前Element是否为table
		if (this.nodeName !== 'TABLE') {
			base.outLog('不支持对非table标签实例化', 'error');
			return;
		}
		// 方法名
		let name = null;

		// 参数
		let	arg = null;

		// 回调函数
		let	callback = null;

		// 条件
		let	condition = null;

		// 格式化参数
		// ex: document.querySelector('table').GridManager()
		if (arguments.length === 0) {
			name = 'init';
			arg = {};
			callback = undefined;
		} else if (jTool.type(arguments[0]) !== 'string') {
			// ex: document.querySelector('table').GridManager({arg}, callback)
			name = 'init';
			arg = arguments[0];
			callback = arguments[1];
		} else {
			// ex: document.querySelector('table').GridManager('get')
			// ex: document.querySelector('table').GM('showTh', $th);
			// ex: document.querySelector('table').GM('setSort',sortJson,callback, refresh);
			name = arguments[0];
			arg = arguments[1];
			callback = arguments[2];
			condition = arguments[3];
		}

        if (name === 'init' && (!arg.columnData || (!arg.ajax_data && !arg.ajax_url))) {
            base.outLog(`方法调用错误，缺失必要参数:[columnData、(ajax_data || ajax_url)]`, 'error');
            return;
        }

		if (publishMethodArray.indexOf(name) === -1) {
			base.outLog(`方法调用错误，请确定方法名[${name}]是否正确`, 'error');
			return;
		}

		// 非init方法, 且当前并未实例化
		const settings = GridManager.get(this);
		if (name !== 'init' && (!settings || !settings.gridManagerName)) {
			base.outLog(`方法调用错误，请确定表格已实例化`, 'error');
			return;
		}

		if (name !== 'init') {
            return PublishMethod[name](this, arg, callback, condition) || this;
        }

        // init
        const $table = jTool(this);
        // 参数中未存在配置项 gridManagerName: 使用table DOM 上的 grid-manager属性
        if (typeof arg.gridManagerName !== 'string' || arg.gridManagerName.trim() === '') {
            // 存储gridManagerName值
            arg.gridManagerName = base.getKey($table);
            // 参数中存在配置项 gridManagerName: 更新table DOM 的 grid-manager属性
        } else {
            $table.attr(base.key, arg.gridManagerName);
        }

        base.SIV_waitTableAvailable[arg.gridManagerName] = setInterval(() => {
            let thisWidth = window.getComputedStyle(this).width;
            if (thisWidth.indexOf('px') !== -1) {
                clearInterval(base.SIV_waitTableAvailable[arg.gridManagerName]);
                base.SIV_waitTableAvailable[arg.gridManagerName] = null;
                PublishMethod[name](this, arg, callback, condition);
            }
        }, 50);
	};
})(jTool);

/**
 * 将GridManager 对象映射至window
 */
(() => {
	window.GridManager = window.GM = GridManager;
})();

/*
* 兼容jQuery
* */
(jQuery => {
	if (typeof (jQuery) !== 'undefined' && jQuery.fn.extend) {
		jQuery.fn.extend({
			GridManager: function () {
				if (arguments.length === 0) {
					return this.get(0).GridManager();
				} else if (arguments.length === 1) {
					return this.get(0).GridManager(arguments[0]);
				} else if (arguments.length === 2) {
					return this.get(0).GridManager(arguments[0], arguments[1]);
				} else if (arguments.length === 3) {
					return this.get(0).GridManager(arguments[0], arguments[1], arguments[2]);
				}
			}
		});
		// 提供简捷调用方式
		jQuery.fn.extend({
			GM: jQuery.fn.GridManager
		});
	}
})(window.jQuery);

// 恢复jTool占用的$变量
(jQuery => {
	window.$ = jQuery || undefined;
})(window.jQuery);

export default GridManager;
