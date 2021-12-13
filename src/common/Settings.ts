/**
 * Settings: 配置项
 */
import { noop, extend } from '@jTool/utils';

/**
 * 框架相关配置
 */
const frameworks = {
    // @2.6.0
    // vue框架解析器，在gridmanager-vue项目中使用
    // compileVue: null,

    // @2.6.13
    // angularjs框架解析器，在gridmanager-angularjs项目中使用
    // compileAngularjs: null,

    // react框架解析器
    // compileReact: null
};

/**
 * 拖拽
 */
const drag = {
    // 是否支持拖拽功能
    supportDrag: true,

    // 拖拽前事件
    dragBefore: noop,

    // 拖拽后事件
    dragAfter: noop
};

/**
 * 行移动
 */
const moveRow = {
    // 是否支持行移动
    supportMoveRow: false,

    // 行移动配置项
    moveRowConfig: {
        // 指定移动后需要更新的字段, 该字段未配置时将只对DOM进行更新
        // key: undefined,

        // 单列移动模式: 为true时将生成单独的一列
        // useSingleMode: false,

        // 行移动列固定方向: 仅在单列移动模式下生效, 如果右侧存在固定列则该列必须配置为left
        // fixed: undefined,

        // 移动后执行的程序，可在该程序中完成与后端的交互
        handler: noop
    }
};

/**
 * 宽度调整
 */
const adjust = {
    // 是否支持宽度调整功能
    supportAdjust: true,

    // 宽度调整前事件
    adjustBefore: noop,

    // 宽度调整后事件
    adjustAfter: noop
};

/**
 * 右键菜单
 */
const menu = {
    supportMenu: true,
    menuHandler: (list: Array<object>): Array<object> => list
};

/**
 * 配置列表
 */
const config = {
    // 是否支持配置列表功能[操作列是否可见]
    supportConfig: true,

    // 配置区域的描述信息
    configInfo: '配置列的显示状态'
};

/**
 * 样式
 */
const gridStyle = {
    // 宽度配置
    width: '100%',

    // 高度配置
    height: '300px',

    // 最小高度
    // minHeight: undefined, // v2.16.1增加

    // 最大高度
    // maxHeight: undefined, // v2.16.1增加

    // 行高度，当某个td的高度超出该数值时，当前行的高度将等于该td的高度 // v2.17.0增加
    lineHeight: '41px',

    // 动画效果时长
    animateTime: 300,

    // 配置是否禁用单元格分割线
    disableLine: false,  // v2.6.1新增

    // 配置是否禁用边框线
    disableBorder: false,  // v2.6.1新增

    // 是否禁用自动loading
    // disableAutoLoading: false,

    // 数据加载中模板 v2.6.2新增
    loadingTemplate: '<section class="gm-loading"><div class="loader"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none"></circle></svg></div></section>',

    //  皮肤样式所使用的className
    skinClassName: '', // v2.7.0 新增

    // td内的文本是否进行断字
    useWordBreak: false, // v2.13.2 新增

    // 是否使用单元格触焦, 启用后点击单元格会增加高亮样式，并且在快捷菜单中将出现复制功能
    // useCellFocus: false,

    // 是否使用行隐藏功能，启用后快捷菜单中将出现隐藏行功能
    // useHideRow: false, // v2.16.0

    // 表头的icon图标是否跟随文本
    isIconFollowText: false // v2.7.0 新增
};

/**
 * 事件
 * 这里初始值为null而非() => {}的原因: 未配置时不进行事件绑定，以降低性能消耗
 * @type {{disableHover: boolean}}
 */
const events = {
    // 单行hover事件
    // @ts-ignore
    rowHover: null,

    // 单行点击事件
    // @ts-ignore
    rowClick: null,

    // 单元格hover事件
    // @ts-ignore
    cellHover: null,

    // 单元格点击事件
    // @ts-ignore
    cellClick: null
};

/**
 * 本地缓存
 */
const cache = {
    // 是否禁用本地缓存
    disableCache: true
};

/**
 * 排序
 */
const sort = {
    // 是否为组合排序[只有在支持排序的情况下生效
    isCombSorting: false,

    // 配置是否合并排序字段
    // false: {sort_createDate: 'DESC', sort_title: 'ASC'}
    // true: sort: 'createDate: "DESC"'
    mergeSort: false,

    // mergeSort=true: 排序所使用的字段名, 示例: 列名='createDate', sortKey='orderBys', 排序参数为: orderBys: 'createDate:"DESC"'
    // mergeSort=false: 排序所使用的字段名前缀, 示例: 列名='createDate', sortKey='sort_', 排序参数为: sort_createDate: 'DESC'
    sortKey: 'sort_',

    // 存储排序数据[不对外公开参数]
    sortData: {},

    // 排序：升序标识[该标识将会传至数据接口]
    sortUpText: 'ASC',

    // 排序：降序标识[该标识将会传至数据接口]
    sortDownText: 'DESC',

    // 排序模式: single(升降序单一触发) overall(升降序整体触发)
    sortMode: 'overall',

    // 排序事件发生前
    sortingBefore: noop,

    // 排序事件发生后
    sortingAfter: noop
};

/**
 * 分页
 */
const ajaxPage = {
    // 是否支持配置列表ajxa分页
    supportAjaxPage: false,

    // 是否使用无总条数模式
    useNoTotalsMode: false,

    // 异步分页模式, 默认值undefined。注意: 当useNoTotalsMode:true 时，该配置失效
    // asyncTotals: {
    //     text: '<span style="color: #999">加载中...</span>',
    //     handler: (settings, params) => {
    //         console.log(params);
    //         return new Promise(resolve => {
    //             jTool.ajax({
    //                 url: 'https://www.lovejavascript.com/blogManager/getBlogList',
    //                 type: 'POST',
    //                 success: res => {
    //                     resolve(JSON.parse(res).totals);
    //                 }
    //             });
    //         })
    //     }
    // },

    // 分页区域自定义模板
    // ajaxPageTemplate: undefined,

    // 用于配置列表每页展示条数选择框
    sizeData: [10, 20, 30, 50, 100],

    // 每页显示条数，如果使用缓存且存在缓存数据，那么该值将失效
    pageSize: 20,

    // 存储分页数据[不对外公开参数]
    pageData: {},

    // 返回数据中数据总条数的key键值,默认为totals
    totalsKey: 'totals',

    // 请求参数中当前页的key键值,默认为cPage
    currentPageKey: 'cPage',

    // 请求参数中每页显示条数的key健值, 默认为pSize
    pageSizeKey: 'pSize',

    // 分页事件发生前
    pagingBefore: noop,

    // 分页事件发生后
    pagingAfter: noop
};

/**
 * 序号
 */
const autoOrder = {
    // 是否支持自动序号
    supportAutoOrder: true,

    // 自动序号配置
    autoOrderConfig: {
        // 固定列, 默认为undefined
        // fixed: undefined,

        // 宽度
        width: 50 // @2.15.3
    }
};

/**
 * 选择与反选
 */
const checkbox = {
    // 是否支持选择框
    supportCheckbox: true,

    // 选择框配置
    checkboxConfig: {
        // 是否通过点击行来进行选中
        // useRowCheck: undefined,

        // 当前选中操作是否使用单选
        // useRadio: undefined

        // 触发刷新类操作时(搜索、刷新、分页、排序、过滤)，是否禁用状态保持
        // disableStateKeep: undefined, // @2.16.1 新增

        // 指定选中操作精准匹配字段，该值需保证每条数据的唯一性。默认不指定，对整条数据进行匹配。配置此项可提升选中操作性能, 数据量越大越明显。
        // key: undefined, // @2.11.9新增

        // 复选时最大可选数，生效条件: supportCheckbox === true && useRadio === false
        // max: undefined // @2.9.8 新增

        // 是否使用固定列, 默认为undefined
        // fixed: undefined, // @2.11.0

        // 宽度
        width: 40 // @2.15.3
    },

    // 选择事件执行前事件
    checkedBefore: noop,

    // 选择事件执行后事件
    checkedAfter: noop,

    // 全选事件执行前事件
    checkedAllBefore: noop,

    // 全选事件执行后事件
    checkedAllAfter: noop
};

/**
 * 国际化
 */
const i18n = {
    // 选择使用哪种语言，暂时支持[zh-cn:简体中文，en-us:美式英语, zh-tw: 繁体中文] 默认zh-cn
    i18n: 'zh-cn'
};

const treeData = {
    // 用于配置是否支持树型表格
    supportTreeData: false,

    treeConfig: {
        // 树展开操作按键所属容器，此处配置columnData的key值。未配置时，将默认选择columnData的第一项
        // insertTo: undefined,

        // 层级关键字段
        treeKey: 'children',

        // 初始打开状态
        openState: false
    }
};

/**
 * 数据交互相关项
 */
const gridData = {
    // 表格grid-manager所对应的值[可在html中配置]
    // gridManagerName: '',

    // 列配置
    // columnData: [],
    /* columnData示例
    columnData: [{

        // 列的唯一索引。字符串类型，必设项
        key: 'url',

        // 列的显示文本。字符串类型，必设项
        text: 'url',

        // @2.4.0
        // 是否显示, 默认值 true
        isShow: true,

        // @2.6.13
        // 该列是否禁止使用个性配置功能(宽度调整、位置更换、列的显示隐藏)
        disableCustomize: false

        // 指定当前列禁止触发行移动事件，默认为:false
        disableMoveRow: false,

        // @2.11.5
        // 指定当前列禁止触发行选中事件，默认为:false
        disableRowCheck: false,

        // @2.8.12
        // 是否将相同数据列合并，在配置template的情况下会以template的执行结果进行比对
        merge: false,

        // 列所占宽度, 字符串类型，非必设项
        // 需要注意的是:
        // 1.如果当前列的th内文本实际占用宽度大于该参数指定的宽度时， GridManager会自动进行适配。
        // 2.建议不要将所有的列都进行宽度设置，而留一个进行自动适应
        width: '100px',

        // 列文本对齐信息，字符串类型，非必设项
        // 三种值: 'left', 'center', 'right'
        align: '',

        // 固定列, 使用后 disableCustomize 将强制变更为true
        // 两种值: 'left', 'right'
        fixed: undefined,

        // 列的排序类型，字符串类型，非必设项
        // 1、'': 该列支持排序，但初始化时不指定排序类型
        // 2、'DESC': 该列支持排序，并在初始化时指定排序类型为降序。可通过参数[sortDownText]来指定降序所使用的字符串
        // 3、'ASC': 该列支持排序，并在初始化时指定排序类型为升序。可通过参数[sortUpText]来指定升序所使用的字符串
        sorting: 'DESC',

        // 列的表头提醒内容, [string | object]非必设项
        // remind: '文本介绍',
        remind: {  // object形式
            text: '文本介绍',
            style: {
                'width': '100px',
                'font-size': '14px'
            }
        },

        // 表头筛选条件, 该值由用户操作后会将选中的值以{key: value}的形式覆盖至query参数内。非必设项
        filter: {
            // 筛选条件列表, 数组对象。格式: [{value: '1', text: 'HTML/CSS'}],在使用filter时该参数为必设项。
            option: [],
            // 筛选选中项，字符串, 默认为''。 非必设项，选中的过滤条件将会覆盖query
            selected: '3',
            // 否为多选, 布尔值, 默认为false。非必设项
            isMultiple: false
        },
        // 自定义列模板，函数类型，非必设项
        // 通过返回的字符串对列进行重绘
        // nodeData: 当前单元格的渲染数据
        // rowData: 当前单元格所在行的渲染数据, 本例中: 参数nodeData=== rowData.url
        template: function(nodeData, rowData){
            return '<a href="'+nodeData+'">'+rowData.url+'</a>';
        }
     }]
    */

    // tr区域顶部通栏
    /*
    fullColumn: {
        topTemplate: () => {}, // 上通栏
        bottomTemplate: () => {}, // 下通栏
        useFold: false, // 是否使用折叠
        interval: 0, // 间距

        // 折叠事件列固定方向: 仅在useFold===true时生效，默认值为undefined，可选值: 'left', 'right'
        fixed: false,

        // 默认展开状态: 仅在useFold===true时生效
        openState: false
    },
    */

    // @2.5.8
    // 初次渲染时是否加载数据
    firstLoading: true,

	// 启用虚拟滚动 @2.18.0
	useVirtualScroll: true,

    // @2.6.0 不再建议使用且在外续版本中会被移除
    // 后端API调用地址
    // ajax_url: '',

    // 后端API调用, [string url | function {retrun string url | promise | data}] @v2.6.0
    // ajaxData: undefined,

    // ajax请求类型['GET', 'POST']默认GET
    ajaxType: 'GET',

    // 其它需要带入的参数，该参数中设置的数据会在分页或排序事件中以参数形式传递
    // 过滤中的选中值将会覆盖query参数
    query: {},

    // ajax请求头信息
    ajaxHeaders: {},

    // @v2.4.0
    // 设置XHR对象, ajaxXhrFields 中的属性将追加至实例化后的XHR对象上
    // 示例 -> ajaxXhrFields: {withCredentials: true}, 那么将会配置跨域访问时协带cookies, authorization headers(头部授权)
    ajaxXhrFields: {},

    // ajax请求之前,与jTool的beforeSend使用方法相同
    ajaxBeforeSend: noop,

    // ajax成功后,与jTool的success使用方法相同
    ajaxSuccess: noop,

    // ajax完成后,与jTool的complete使用方法相同
    ajaxComplete: noop,

    // ajax失败后,与jTool的error使用方法相同
    ajaxError: noop,

    // 请求前处理程序, 可以通过该方法修改全部的请求参数 @v2.3.14
    requestHandler: (request: object) => request,

    // 执行请求后执行程序, 通过该程序可以修改返回值格式. 仅有成功后该函数才会执行 @v2.3.14
    responseHandler: (response: object) => response,

    // 单行数据渲染时执行程序
    rowRenderHandler: (row: object) => row,

    // 汇总处理函数
    summaryHandler: (data: object) => { return {}; },

    // 返回数据中列表数据的key键值,默认为data
    dataKey: 'data',

    // 为空时显示的html
    emptyTemplate: () => '<div class="gm-empty-template">暂无数据</div>'
};

/**
 * 表格导出
 */
const gridExport = {
    // 支持导出表格数据
    supportExport: true,

    // 导出相关配置
    exportConfig: {
        // 导出的方式: 默认为static
        // 1.static: 前端静态导出, 无需后端提供接口，该方式导出的文件并不完美。
        // 2.blob: 通过后端接口返回二进制流。`nodejs`可使用`js-xlsx`, `java`可使用 `org.apache.poi`生成二进制流。
        // 3.url: 通过配置或由后端返回下载地址
        mode: 'static',

        // 导出文件的名称, 字符串或函数类型，为函数时需返回一个字符串。该字符串不包含后缀名，该值不设置将默认使用_
        // fileName: undefined,

        // 导出的后缀名, 默认为`xls`。静态导出仅支持xls,cvs两种格式
        suffix: 'xls',

        // 导出处理器函数:
        // mode === 'static'时，handler函数return 二维数组;
        // return [["title", "content", "createData"],["typescript", "this is typescript", "2015-01-01"]]

        // mode === 'blob'时，handler函数需要返回resolve(blob)的promise
        // 需要通过promise中的resolve()返回二进制流(blob)，有两种返回格式:
        // 1. return new Promise(resolve => {resolve(blob)});
        // 2. return new Promise(resolve => {resolve({data: blob})});

        // mode === 'url'时，handler函数需要返回url或返回resolve(url)的promise
        // 1. return 'xxx.xxx.com/xxx.xls';
        // 2. return new Promise(resolve => {resolve('xxx.xxx.com/xxx.xls')})

        handler: noop
    }
};
/**
 * 表格打印
 */
const gridPrint = {
    // 支持打印功能
    supportPrint: true
};
export function Settings() {
    extend(true, this, {
        // 是否加载完成，用于调用公开方法确认
        rendered: false,
        ...frameworks,
        ...drag,
        ...moveRow,
        ...adjust,
        ...menu,
        ...config,
        ...gridStyle,
        ...cache,
        ...sort,
        ...ajaxPage,
        ...autoOrder,
        ...checkbox,
        ...i18n,
        ...gridData,
        ...gridExport,
        ...gridPrint,
        ...treeData,
        ...events
    });
}
