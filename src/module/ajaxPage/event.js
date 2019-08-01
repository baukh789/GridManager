/**
 * 分页功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 */
import { TOOLBAR_KEY } from '@common/constants';
export default function getAjaxEvent(gridManagerName) {
    const target = `[${TOOLBAR_KEY}="${gridManagerName}"]`;
    return {
        // 快捷跳转
        gotoPage: {events: 'keyup', target, selector: '.gp-input'},

        // 第一页
        firstPage: {events: 'click', target, selector: '[pagination-before] .first-page'},

        // 上一页
        previousPage: {events: 'click', target, selector: '[pagination-before] .previous-page'},

        // 下一页
        nextPage: {events: 'click', target, selector: '[pagination-after] .next-page'},

        // 尾页
        lastPage: {events: 'click', target, selector: '[pagination-after] .last-page'},

        // 页码
        numberPage: {events: 'click', target, selector: '[pagination-number] li'},

        // 刷新
        refresh: {events: 'click', target, selector: '.refresh-action'}
    };
}
