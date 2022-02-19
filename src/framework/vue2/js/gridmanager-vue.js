import Vue from 'vue2/dist/vue.js'; // todo 这里不应该用这个，需要手动去解决 template 向render替换， 目前该文件内有两处。
import $gridManager, { jTool } from '../../../module/index';
export { $gridManager, jTool };
export default {
    name: 'GridManagerVue',
    props: {
        option: {
            type: Object,
            default: {}
        },
        callback: {
            type: Function,
            default: query => query
        }
    },
	// render: h => {
    // 	return h('table');
	// },
    template: '<table></table>',
    mounted() {
        // 寻找真实的父级组件: 防止多层嵌套后methods丢失问题
        let _parent = this.$parent;
        const setParent = obj => {
            if (!obj) {
                return;
            }
            for (let key in obj) {
                if (obj[key] === this.$props.option) {
                    _parent = obj;
                    return;
                }
            }
            setParent(obj.$parent);
        };
        setParent(_parent);
        const { methods, components } = _parent.$options;

        // 存储Vue实例
        let vueCache = [];

        // 更新Vue存储实例
        const updateVueCache = () => {
            vueCache = vueCache.filter(vm => {
                const { $el } = vm;
                if (!getComputedStyle($el).display) {
                    // 清除framework.send 后存在操作的DOM节点
                    const tree = $el.querySelector('[tree-element]');
                    tree && $el.removeChild(tree);

                    vm.$destroy();
                }
                return !!getComputedStyle($el).display;
            });
        };

        // 解析Vue 模版, data中的row为固定元素
        this.option.compileVue = compileList => {
            // let attributes = null;
            // let children = null;
            updateVueCache();
            return new Promise(resolve => {
                compileList.forEach(item => {
                    const el = item.el;

                    // 继承父对像 methods: 用于通过this调用父对像的方法
                    const methodsMap = {};
                    for (let key in methods) {
                        methodsMap[key] = methods[key].bind(_parent);
                    }

                    // 合并父对像 data
                    const dataMap = {
                        row: item.row,
                        index: item.index
                    };
                    Object.assign(dataMap, _parent.$data);

                    // create new vue
                    vueCache.push(new Vue({
                        parent: _parent,
                        el: el,
                        data: () => dataMap,
                        methods: methodsMap,
                        template: el.outerHTML,
						// todo #001 这里修改时，需要考虑下原生与框架结何时，是否可以直接使用未渲染的字符串进行框架解析
						// render: h => {
                        // 	const attribute = {
						// 		class: 'th-text gm-drag-action',
						// 		attrs: {
						// 			'data-compile-node': ''
						// 		}
						// 	};
						// 	return h('thead', attribute, '<tr><td>11</td><td>11</td></tr>');
						// },

                        // 因为实际上表格组件重新创建了域，所以这块用来解决在表格中无法使用父组件所注册组件的问题
                        components
                    }));
                });
                resolve();
            });
        };

        // 存在错误的 vue文件，其中的模板会污染表格组件中使用到的template
        if (this.$el.nodeName !== 'TABLE') {
            console.error('Wrong .vue: ', this.$el);
            return;
        }
        // 调用原生组件进行实例化
        new $gridManager(this.$el, this.option, query => {
            typeof (this.callback) === 'function' && this.callback(query);
        });
    },

    /**
     * 消毁事件
     */
    destroyed() {
        // 销毁实例
        $gridManager.destroy(this.option.gridManagerName);
    },

    /**
     * keep-alive事件
     */
    activated() {
        const settings = $gridManager.get(this.option.gridManagerName);
        if (settings.rendered) {
            $gridManager.resetLayout(this.option.gridManagerName, settings.width, settings.height);
        }
    }
};
