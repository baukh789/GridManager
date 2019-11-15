/*
 *  GridManager: 挂载至Element、window、jQuery
 *  #001: 如果已经存在，则清除之前的实例，重新进行实例化。原因：如果不清除而直接返回错误，会让使用者存在不便。
 * */
import jTool from '@common/jTool';
import { outError, isString } from '@common/utils';
import GridManager from './GridManager';

/*
*  捆绑至选择器对象
* */
(() => {
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

		const _ = arguments;
		// 格式化参数
		if (!isString(_[0])) {
			// ex: document.querySelector('table').GridManager({arg}, callback)
			name = 'init';
			arg = _[0];
			callback = _[1];
		} else {
			// ex: document.querySelector('table').GridManager('get')
			// ex: document.querySelector('table').GM('showTh', $th);
			// ex: document.querySelector('table').GM('setSort',sortJson,callback, refresh);
			name = _[0];
			arg = _[1];
			callback = _[2];
			condition = _[3];
		}

		// no init: 执行
		if (name !== 'init') {
            return GridManager[name](this, arg, callback, condition) || this;
        }

        // init
        new GridManager(this, arg, callback);
	};
})();

/**
 * 将GridManager 对象映射至window
 */
(() => {
    // window只存储第一次加载的GM对像, 后续加载的对像将不再向window上挂载
    if (!window.GridManager && !window.GM) {
        window.GridManager = window.GM = GridManager;
    }
})();

/*
* 兼容jQuery
* */
(jQuery => {
    if (!jQuery) {
        return;
    }

    const runFN = function () {
        return this.get(0).GM(...arguments);
    };

    jQuery.fn.extend({
        GridManager: runFN,

        // 提供简捷调用方式
        GM: runFN
    });

    // 恢复jTool占用的$变量
    window.$ = jQuery;
})(window.jQuery);

export { jTool };
export default GridManager;
