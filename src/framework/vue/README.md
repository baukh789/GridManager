# GridManager Vue
> 基于 Vue 的 GridManager 封装, 用于便捷的在 Vue 中使用GridManager. 除过Vue特性外，其它API与GridManager API相同。

## API
> 在相同的API的基本上，支持了Vue的特性。该文档为原生GridManager的文档，vue版本除了在`columnData.text` `columnData.template` `topFullColumn.template`中可以使用vue模版外，其它使用方式相同。
- [API](http://gridmanager.lovejavascript.com/api/index.html)

## 安装
```
npm install gridmanager --save
```

## 项目中引用
- es2015引入方式
```javascript
import GridManager from 'gridmanager/vue2';
import 'gridmanager/index.css';
```

- 通过script标签引入
```html
<link rel="stylesheet" href="gridmanager/index.css">
<script src="gridmanager/vue2.js"></script>
```
### Vue全局组件
```javascript
import GridManager from 'gridmanager/vue2';
import 'gridmanager/index.css';
Vue.use(GridManager);
```

### Vue局部组件
```javascript
import GridManager from 'gridmanager/vue';
import 'gridmanager/index.css';

new Vue({
    el: '#app',
    components: {
        GridManager
    }
});
```

### 示例
```html
<grid-manager :option="gridOption" :callback="callback" ref="grid"></grid-manager>
```

```javascript

const app = new Vue({
    el: '#app',
    data: {
        // 表格渲染回调函数
        // query为gmOptions中配置的query
        callback: function(query) {
            console.log('callback => ', query);
        },

        // 表格
        gridOption: {
            // 表格唯一标识
            gridManagerName: 'test-gm',

            // 高度
            height: '300px',

            // 首次是否加载
            firstLoading: false,

            // 列配置
            columnData: [
                {
                    key: 'shopId',
                    width: '180px',
                    text: '店铺id',
                    align: 'center'
                },{
                    key: 'platId',
                    text: '平台',

                    // template=> function: return dom
                    // 参数介绍
                    // platId: 当前行数据中与配置项key相同字段的值
                    // row: 当前行数据
                    // index: 当前行所在数据中的索引值
                    template: (platId, row, index) => {
                        const span = document.createElement('span');
                        span.style.color = 'blue';
                        span.innerText = platId;
                        return span;
                    }
                },{
                    key: 'platNick',
                    text: '店铺名称',

                    // template=> string dom
                    template: `<span style="color: red">跟据相关法规，该单元格被过滤</span>`
                },{
                    key: 'createTime',
                    text: '创建时间',
                },{
                    key: 'updateTime',
                    text: '更新时间',

                    // 表头筛选条件, 该值由用户操作后会将选中的值以{key: value}的形式覆盖至query参数内。非必设项
                    filter: {
                        // 筛选条件列表, 数组对象。格式: [{value: '1', text: 'HTML/CSS'}],在使用filter时该参数为必设项。
                        option: [
                            {value: '1', text: 'HTML/CSS'},
                            {value: '2', text: 'nodeJS'},
                            {value: '3', text: 'javaScript'},
                            {value: '4', text: '前端鸡汤'},
                            {value: '5', text: 'PM Coffee'},
                            {value: '6', text: '前端框架'},
                            {value: '7', text: '前端相关'}
                        ],
                        // 筛选选中项，字符串, 默认为''。 非必设项，选中的过滤条件将会覆盖query
                        selected: '3',
                        // 否为多选, 布尔值, 默认为false。非必设项
                        isMultiple: false
                    },
                    // template=> function: return string dom
                    template: updateTime => {
                        return `<span style="color: blue">${updateTime}</span>`;
                    }
                },{
                    key: 'action',
                    text: '操作',
                    width: '100px',
                    align: 'center',

                    // template=> function: return vue template
                    // vue模版中将自动添加row字段，该字段为当前行所使用的数据
                    // vue模版将不允许再使用template函数中传入的参数
                    template:() => {
                        return '<el-button size="mini" type="danger" @click="delRelation(row)">解除绑定</el-button>';
                    }
                }
            ],
            // 使用分页
            supportAjaxPage: true,

            // 数据来源，类型: string url || data || function return[promise || string url || data]
            ajaxData: (settings, params) => {
                return tenantRelateShop(params);
            },

            // 请求失败后事件
            ajaxError: err => {
                console.log(err);
            },

            // checkbox选择事件
            checkedAfter: rowList => {
                this.selectedCheck(rowList);
            },

            // 每页显示条数
            pageSize: 20

            // ...更多配置请参考API
        }
    },
    methods: {
        // 解除绑定
        delRelation: function(row) {
            // ... 解除绑定操作
        }
    }
});
```

### 关于配置项中的this指向
#### 可能引起this指向错误的方式:
- 表格配置项在data中配置时，配置项内所包含的函数this指向并不是VueComponents。
- 使用Class声明方式时，配置项内所包含的函数this指向为class，而非VueComponents。

#### 解决方法:
可以通过将的配置项在在created内来实现，如:
```
created() {
    this.gridOption = {
        gridManagerName: 'test',
        ... // 其它配置项
    };
}
```

### 调用公开方法
> 通过ES6语法，将GridManager引入, 如果使用`this.$gridManager`服务需要提前通过`Vue.use(GridManager)`将`GridManager`注册至全局组件。

```javascript
import GridManager, { $gridManager } from 'gridmanager';
Vue.use(GridManager);
// 刷新
GridManager.refreshGrid('test-gm'); // 或 this.$gridManager.refreshGrid('test-gm');

// 更新查询条件
GridManager.setQuery('test-gm', {name: 'baukh'});  // 或 this.$gridManager.setQuery('test-gm', {name: 'baukh'});

// ...其它更多请直接访问API
```

### 查看当前版本

```javascript
import GridManager from 'gridmanager/vue2';
console.log('GridManager', GridManager.version);
```
