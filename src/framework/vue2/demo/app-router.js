import './style.css';
// 0. 如果使用模块化机制编程，导入Vue和VueRouter，要调用 Vue.use(VueRouter)
import GridManagerVue, { $gridManager } from '../js/index';
// 模拟的一个promise请求
const getBlogList = function(paramse) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://www.lovejavascript.com/blogManager/getBlogList');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                resolve(xhr.response);
            } else {
                reject(xhr);
            }
        };

        // 一个简单的处理参数的示例
        let formData = '';
        for (let key in paramse) {
            if(formData !== '') {
                formData += '&';
            }
            formData += key + '=' + paramse[key];
        }
        xhr.send(formData);
    });
};
Vue.use(GridManagerVue);
const option = {
    supportRemind: true,
    gridManagerName: 'test',
    height: '100%',
    supportAjaxPage: true,
    isCombSorting: false,
    disableCache: true,
    ajaxData: (settings, params) => {
        return getBlogList(params);
    },
    // ajaxData: ajaxData2,
    // supportTreeData: true,
    ajaxType: 'POST',
    query: {test: 22},
    pageSize: 30,
    columnData: [
        {
            key: 'pic',
            remind: 'the pic',
            width: '140px',
            align: 'center',
            text: '缩略图',
            template: () => {
                console.log(111);
                return ''
            }
        }, {
            key: 'title',
            remind: 'the title',
            align: 'left',
            text: '标题'
        }
    ]
}
// 1. 定义 (路由) 组件。
// 可以从其他文件 import 进来
const Foo = Vue.component('my-component', {
    template: '<div><grid-manager :option="option" ref="grid"></grid-manager></div>',
    data: function () {
        return {
            option: option
        }
    },
})
const Bar = { template: '<div>bar</div>' }

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
// 我们晚点再讨论嵌套路由。
const routes = [
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
    routes // (缩写) 相当于 routes: routes
})

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
const app = new Vue({
    router
}).$mount('#app')

// 现在，应用已经启动了！
