/**
 * Created by baukh on 17/10/24.
 * 实例化数据的存储对象
 */

const Store = {
	// 版本号
	version: '2.3.15',

	// GM实例
	gridManager: {},

	// GM使用的数据
	responseData: {},

	// 表渲染前的th
	originalTh: {},

	// TODO 这里需做个调整, 将宽度调整 显示状态 排序状态 等信息即时更新到settings内, 再通过settings的值更新DOM. 以达到数据驱动的效果
	// 配置信息
	settings: {}
};

export default Store;
