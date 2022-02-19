/**
 * Created by baukh on 18/3/8.
 */
import GridManagerVue, { $gridManager, jTool } from './gridmanager-vue';

// Vue install, Vue.use 会调用该方法。
GridManagerVue.install = (Vue, opts = {}) => {
    // 将构造函数挂载至Vue原型上
    // 这样在Vue环境下，可在实例化对像this上使用 this.$gridManager 进行方法调用
    Vue.prototype.$gridManager = $gridManager;
    Vue.component('grid-manager', GridManagerVue);
};

// 通过script标签引入Vue的环境
if (typeof window !== 'undefined' && window.Vue) {
    GridManagerVue.install(window.Vue);
}

// GridManagerVue 的版本号。 需要注意的是: 这仅仅是vue环境的壳, 验证功能需要查看GridManager的版本号
GridManagerVue.version = process.env.VERSION;

// 将原生方法，挂载至 Vue GridManager 上
const staticList = Object.getOwnPropertyNames($gridManager);
const noExtendsList = ['name', 'length', 'prototype', 'version'];
staticList.forEach(key => {
    if (!noExtendsList.includes(key)) {
        GridManagerVue[key] = $gridManager[key];
    }
});
export { $gridManager, jTool };
export default GridManagerVue;

