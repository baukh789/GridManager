/**
 * 分页功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 */
export default function getAjaxEvent(gridManagerName, scope) {
    return {
        // 快捷跳转
        gotoPage: {events: 'keyup', selector: `${scope} .gp-input`},

        // 第一页
        firstPage: {events: 'click', selector: `${scope} [pagination-before] .first-page`},

        // 上一页
        previousPage: {events: 'click', selector: `${scope} [pagination-before] .previous-page`},

        // 下一页
        nextPage: {events: 'click', selector: `${scope} [pagination-after] .next-page`},

        // 尾页
        lastPage: {events: 'click', selector: `${scope} [pagination-after] .last-page`},

        // 页码
        numberPage: {events: 'click', selector: `${scope} [pagination-number] li`},

        // 刷新
        refresh: {events: 'click', selector: `${scope} .refresh-action`},

        // 切换每页显示条数
        changePageSize: {events: 'change', selector: `${scope} select[name=pSizeArea]`}
    };
}
