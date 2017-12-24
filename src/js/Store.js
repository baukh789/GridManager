/**
 * Created by baukh on 17/10/24.
 * 实例化数据的存储对象
 */
import { GM_VERSION } from '../common/constants';
const Store = {
	// 版本号
	version: GM_VERSION,

	// GM实例
	gridManager: {},

	// GM使用的数据
	responseData: {},

	// 表渲染前的th
	originalTh: {},

	// 表配置信息存储器
	settings: {
		// columnData: 表配置项, 在宽度\位置等信息变化后 会 即时更新
		// columnMap: 是在GridManager.js中通过columnData生成的, 在宽度\位置等信息变化后 会 即时更新
		// 其它配置项...
	}
};

export default Store;
