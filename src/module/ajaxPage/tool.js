/**
 * #001:
 * 关于ajax-page.tpl.html 文件中的实时更新
 * 有效区域: <div class="footer-toolbar">标签内
 * 触发条件: 以下属性的标签将会触发实时更新，共有以下属性:
 * 1. begin-number-info: 当前页从多少条开始显示
 * 2. end-number-info: 当前页到多少条结束显示
 * 3. current-page-info: 当前页
 * 4. totals-number-info: 总条数
 * 5. totals-page-info: 总页数
 */
import { TOOLBAR_KEY } from '@common/constants';

/**
 * 获取选择器
 * @param gridManagerName
 * @returns {string}
 */
export const getQuerySelector = gridManagerName => {
    return `[${TOOLBAR_KEY}="${gridManagerName}"]`;
};

/**
 * 拼接页码字符串
 * @param currentPageKey
 * @param pageData 分页数据格式
 * @private
 */
export const joinPaginationNumber = (currentPageKey, pageData) => {
    // 当前页
    let cPage = Number(pageData[currentPageKey] || 0);

    // 总页数
    let tPage = Number(pageData.tPage || 0);

    // 临时存储分页HTML片段
    let	tHtml = '';

    // 临时存储末尾页码THML片段
    let	lHtml = '';
    // 循环开始数
    let i = 1;

    // 循环结束数
    let	maxI = tPage;

    // 配置 first端省略符
    if (cPage > 4) {
        tHtml += '<li to-page="1">1</li><li class="disabled">...</li>';
        i = cPage - 2;
    }
    // 配置 last端省略符
    if ((tPage - cPage) > 4) {
        maxI = cPage + 2;
        lHtml += `<li class="disabled">...</li><li to-page="${ tPage }">${ tPage }</li>`;
    }

    // 配置页码
    if (pageData.tSize) {
        for (i; i <= maxI; i++) {
            if (i === cPage) {
                tHtml += `<li class="active">${ cPage }</li>`;
                continue;
            }
            tHtml += `<li to-page="${ i }">${ i }</li>`;
        }
    }
    tHtml += lHtml;

    return tHtml;
};

/**
 * 计算并返回分页数据
 * @param settings
 * @param totals
 * @param len 本次请求返回的总条数，该参数仅在totals为空时使用
 * @returns {{tPage: number, cPage: *, pSize: *, tSize: *}}
 * @private
 */
export const getPageData = (settings, totals, len) => {
    const { pageData, pageSizeKey, pageSize, currentPageKey } = settings;
    const pSize = pageData[pageSizeKey] || pageSize;
    const cPage = pageData[currentPageKey] || 1;

    let tPage = 1;
    if (!totals) {
        tPage = len < pSize ? cPage : cPage + 1;
    } else {
        tPage = Math.ceil(totals / pSize);
    }

    return {
        // 总页数
        tPage: tPage,

        // 当前页
        [currentPageKey]: cPage > tPage ? 1 : cPage,

        // 每页显示条数
        [pageSizeKey]: pSize,

        // 总条数
        tSize: totals
    };
};
