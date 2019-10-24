/*
 *  GridManager: 入口
 *  #001: 如果已经存在，则清除之前的实例，重新进行实例化。原因：如果不清除而直接返回错误，会让使用者存在不便。
 * */
import jTool from '@common/jTool';
import { getKey } from '@common/base';
import { SIV_waitTableAvailable } from '@common/cache';
import { outWarn, outError, isUndefined } from '@common/utils';
import { TABLE_KEY, RENDERING_KEY } from '@common/constants';
import GridManager from './GridManager';
/*
*  捆绑至选择器对象
* */
(jTool => {
	Element.prototype.GM = Element.prototype.GridManager = function () {
		// 验证当前Element是否为table
		if (this.nodeName !== 'TABLE') {
			outError('nodeName !== "TABLE"');
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

        if (name === 'init' && (!arg.columnData || (!arg.ajaxData && !arg.ajax_data && !arg.ajax_url))) {
            outError('columnData or ajaxData undefined');
            return;
        }

        // 当前为查找版本号
        if (name === 'version') {
            return GridManager.version;
        }

		// no init: 执行
		if (name !== 'init') {
            return GridManager[name](this, arg, callback, condition) || this;
        }

        /* ***********  以下为init *************** */

        // 验证并设置正在渲染中标识，防止同时触发多次。渲染完成后将移除该标识
        if (this[RENDERING_KEY]) {
            return;
        }
        this[RENDERING_KEY] = true;

		const $table = jTool(this);
		let gridManagerName = arg.gridManagerName;
        // 参数中未存在配置项 gridManagerName: 使用table DOM 上的 grid-manager属性
        if (typeof gridManagerName !== 'string' || gridManagerName.trim() === '') {
            // 存储gridManagerName值
            arg.gridManagerName = getKey($table);
            gridManagerName = arg.gridManagerName;
            // 参数中存在配置项 gridManagerName: 更新table DOM 的 grid-manager属性
        } else {
            $table.attr(TABLE_KEY, gridManagerName);
        }

        const settings = GridManager.get(gridManagerName);

        // init: 当前已经实例化
        if (settings && settings.rendered) {
            outWarn(`${gridManagerName} had been used`);

            // 如果已经存在，则清除之前的数据。#001
            GridManager.destroy(gridManagerName);
        }

        // init: 执行
        SIV_waitTableAvailable[gridManagerName] = setInterval(() => {
            let thisWidth = window.getComputedStyle(this).width;
            if (thisWidth.indexOf('px') !== -1) {
                clearInterval(SIV_waitTableAvailable[gridManagerName]);
                SIV_waitTableAvailable[gridManagerName] = null;
                return new GridManager().init(this, arg, callback);
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
	if (!isUndefined(jQuery) && jQuery.fn.extend) {
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

export { jTool };
export default GridManager;
