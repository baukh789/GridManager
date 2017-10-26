/**
 * Created by baukh on 17/10/24.
 * 实例化数据的存储对象
 */

class Map {
	constructor() {
		// GM实例
		this.gridManager = {};

		// GM使用的数据
		this.responseData = {};

		// 表渲染前的th
		this.originalTh = {};

		// 配置信息
		this.settings = {};
	}
}
const map = new Map();
export default map;
