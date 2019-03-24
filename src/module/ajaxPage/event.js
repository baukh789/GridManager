/**
 * 分页功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 */
export default function getAjaxEvent(gridManagerName, scope) {
    return {
        // 快捷跳转
        gotoPage: {eventName: 'keyup', eventQuerySelector: `${scope} .gp-input`},

        // 第一页
        firstPage: {eventName: 'click', eventQuerySelector: `${scope} [pagination-before] .first-page`},

        // 上一页
        previousPage: {eventName: 'click', eventQuerySelector: `${scope} [pagination-before] .previous-page`},

        // 下一页
        nextPage: {eventName: 'click', eventQuerySelector: `${scope} [pagination-after] .next-page`},

        // 尾页
        lastPage: {eventName: 'click', eventQuerySelector: `${scope} [pagination-after] .last-page`},

        // 页码
        numberPage: {eventName: 'click', eventQuerySelector: `${scope} [pagination-number] li`},

        // 刷新
        refresh: {eventName: 'click', eventQuerySelector: `${scope} .refresh-action`},

        // 切换每页显示条数
        changePageSize: {eventName: 'change', eventQuerySelector: `${scope} select[name=pSizeArea]`}
    };
}
