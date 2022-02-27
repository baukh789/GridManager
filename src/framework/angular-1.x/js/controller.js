/**
 * Created by baukh on 18/3/8.
 */
export default class GridManagerController {
    constructor($scope, $element, $compile, $gridManager) {
        this._$element = $element;
        this._$compile = $compile;
        this._$scope = $scope;
        this._$gridManager = $gridManager;

        // 存储 angular scope
        this.angularCache = [];
    }

    /**
     * 清除已经不存在的 angular scope
     */
    updateCache() {
        this.angularCache = this.angularCache.filter(item => {
            const { el, scope } = item;
            if (!getComputedStyle(el).display) {
                // 清除framework.send 后存在操作的DOM节点
                const tree = el.querySelector('[tree-element]');
                tree && el.removeChild(tree);

                // 移除angular node
                scope.$destroy();
                el.remove();
            }
            return !!getComputedStyle(el).display;
        });
    }
    $onInit() {
        // 当前表格组件所在的域
        const _parent = this._$scope.$parent;

        // 获取当前组件的DOM
        const table = this._$element[0].querySelector('table');

        const { _$gridManager, option, callback } = this;

        // 模板解析勾子，这个勾子在原生组件内通过sendCompile进行触发
        option.compileAngularjs = compileList => {
            this.updateCache();
            return new Promise(resolve => {
                let scope = null;
                let el = null;
                const $new = _parent.$new.bind(_parent);
                const $compile = this._$compile;
                compileList.forEach(item => {
                    scope = $new(false); // false 不隔离父级
                    scope.row = item.row;
                    scope.index = item.index;
                    scope.key = item.key;
                    el = item.el;

                    // 将生成的内容进行替换
                    el.replaceWith($compile(el)(scope)[0]);

                    this.angularCache.push({el, scope});
                });

                // 延时触发angular 脏检查
                setTimeout(() => {
                    _parent.$digest();
                    resolve();
                });
            });
        };

        // 调用原生组件进行实例化
        new _$gridManager(table, option, query => {
            typeof (callback) === 'function' && callback({query: query});
            // _$gridManager.setScope(table, _parent);
        });
    }

    /**
     * 销毁钩子
     */
    $onDestroy() {
        // 销毁实例
        this._$gridManager.destroy(this.option.gridManagerName);
    }
}
GridManagerController.$inject = ['$scope', '$element', '$compile', '$gridManager'];
