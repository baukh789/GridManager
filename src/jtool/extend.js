import { isBoolean, isObject } from './utils';
export default function extend() {
	// 参数为空,返回空对象
	if (arguments.length === 0) {
		return {};
	}

	let deep = false; // 是否递归
	let	i = 1;
    let	target = arguments[0];
    let	options = null;

	// 参数只有一个且为对象类形 -> 对jTool进行扩展
	if (arguments.length === 1 && isObject(arguments[0])) {
		target = this;
		i = 0;
	} else if (arguments.length === 2 && isBoolean(arguments[0])) { // 参数为两个, 且第一个为布尔值 -> 对jTool进行扩展
		deep = arguments[0];
		target = this;
		i = 1;
	} else if(arguments.length > 2 && isBoolean(arguments[0])) { // 参数长度大于2, 且第一个为布尔值 -> 对第二个Object进行扩展
		deep = arguments[0];
		target = arguments[1] || {};
		i = 2;
	}
	for (; i < arguments.length; i++) {
		options = arguments[i] || {};
		ex(options, target);
	}
	function ex(options, target) {
		for (var key in options) {
			if (options.hasOwnProperty(key)) {
				if(deep && isObject(options[key])) {
					if(!isObject(target[key])) {
						target[key] = {};
					}
					ex(options[key], target[key]);
				} else {
					target[key] = options[key];
				}
			}
		}
	}
	return target;
}
