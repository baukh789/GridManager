// 表格中使用到的国际化文本信息
export default function () {
    // order
    this['order-text'] = {
        'zh-cn': '序号',
        'zh-tw': '序號',
        'en-us': 'order'
    };

    // ajax page
    this['first-page'] = {
        'zh-cn': '首页',
        'zh-tw': '首頁',
        'en-us': 'first'
    };
    this['previous-page'] = {
        'zh-cn': '上一页',
        'zh-tw': '上一頁',
        'en-us': 'previous'
    };
    this['next-page'] = {
        'zh-cn': '下一页',
        'zh-tw': '下一頁',
        'en-us': 'next'
    };
    this['last-page'] = {
        'zh-cn': '尾页',
        'zh-tw': '尾頁',
        'en-us': 'last'
    };

    // page-info 会传入五个值
    // 0: 当前页从多少条开始显示
    // 1: 当前页到多少条结束显示
    // 2: 总条数
    // 3: 当前页
    // 4: 总页数
    this['page-info'] = {
        'zh-cn': '此页显示 {0}-{1}<span class="page-info-totals"> 共{2}条</span>',
        'zh-tw': '此頁顯示 {0}-{1}<span class="page-info-totals"> 共{2}條</span>',
        'en-us': 'this page show {0}-{1}<span class="page-info-totals"> count {2}</span>'
    };

    this['checked-info'] = {
        'zh-cn': '已选 {0} 条',
        'zh-tw': '已選 {0} 條',
        'en-us': 'selected {0}'
    };
    this['goto-first-text'] = {
        'zh-cn': '跳转至',
        'zh-tw': '跳轉至',
        'en-us': 'goto'
    };
    this['goto-last-text'] = {
        'zh-cn': '页',
        'zh-tw': '頁',
        'en-us': 'page'
    };

    this['refresh'] = {
        'zh-cn': '重新加载',
        'zh-tw': '重新加載',
        'en-us': 'Refresh'
    };
    this['export'] = {
        'zh-cn': '导出',
        'zh-tw': '導出',
        'en-us': 'Export'
    };
    this['export-checked'] = {
        'zh-cn': '导出选中项',
        'zh-tw': '導出選中項',
        'en-us': 'Export selected'
    };
    this['config'] = {
        'zh-cn': '配置表',
        'zh-tw': '配置表',
        'en-us': 'Setting Grid'
    };
    this['print'] = {
        'zh-cn': '打印',
        'zh-tw': '打印',
        'en-us': 'Print'
    };
    this['ok'] = {
        'zh-cn': '确定',
        'zh-tw': '確定',
        'en-us': 'OK'
    };
    this['reset'] = {
        'zh-cn': '重置',
        'zh-tw': '重置',
        'en-us': 'Reset'
    };
};
