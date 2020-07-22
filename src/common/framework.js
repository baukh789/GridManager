import { getQuerySelector } from '@common/base';
// 框架解析唯一值
const FRAMEWORK_KEY = 'data-compile-node';

// 解析存储容器
const compileMap = {};

/**
 * 获取当前表格解析列表
 * @param _
 * @returns {*}
 */
export const getCompileList = _ => {
    if (!compileMap[_]) {
        compileMap[_] = [];
    }
    return compileMap[_];
};

/**
 * 清空当前表格解析列表
 * @param _
 */
export const clearCompileList = _ => {
    compileMap[_] = [];
};

/**
 * 解析: fake thead
 * @param settings
 * @param el
 */
export const compileFakeThead = (settings, el) => {
    const { _, compileAngularjs, compileVue, compileReact } = settings;
    if (compileAngularjs || compileVue || compileReact) {
        const compileList = getCompileList(_);
        const thList = el.querySelectorAll(`[${FRAMEWORK_KEY}]`);
        [].forEach.call(thList, (item, index) => {
            const obj = compileList[index];
            compileList.push({...obj});
        });
    }
};

/**
 * 解析: th
 * @param settings
 * @param key
 * @param template
 * @returns {string}
 */
export const compileTh = (settings, key, template) => {
    const { _, compileAngularjs, compileVue, compileReact } = settings;
    const compileList = getCompileList(_);
    let text = '';
    let compileAttr = '';
    if (template) {
        if (compileAngularjs || compileVue || compileReact) {
            compileAttr = FRAMEWORK_KEY;
            compileList.push({ key, template, type: 'text' });
        }

        // not React
        if (!compileReact) {
            text = template();
        }
    }

    return {
        text,
        compileAttr
    };
};

/**
 * 解析: td
 * @param settings
 * @param row
 * @param index
 * @param key
 * @param template
 * @returns {*}
 */
export const compileTd = (settings, template, row, index, key) => {
    const { _, compileAngularjs, compileVue, compileReact } = settings;
    const compileList = getCompileList(_);

    let text = '';
    let compileAttr = '';
    if (template) {
        // React element or React function
        // react 返回空字符串，将单元格内容交由react控制
        if (compileReact) {
            compileAttr = FRAMEWORK_KEY;
            compileList.push({template, row, index, key, type: 'template', fnArg: [row[key], row, index, key]});
        }

        // 解析框架: Angular 1.x || Vue
        if (compileVue || compileAngularjs) {
            compileAttr = FRAMEWORK_KEY;
            compileList.push({row, index, key});
        }

        // not React
        // 非react时，返回函数执行结果
        if (!compileReact) {
            text = template(row[key], row, index, key);
        }
    } else {
        text = row[key] || '';
    }

    return {
        text,
        compileAttr
    };
};

/**
 * 解析: 空模板
 * @param settings
 * @param el
 * @param template
 * @returns {string}
 */
export const compileEmptyTemplate = (settings, el, template) => {
    const { _, compileAngularjs, compileVue, compileReact } = settings;
    const compileList = getCompileList(_);

    // React
    if (compileReact) {
        compileList.push({el, template, type: 'empty', fnArg: [settings]});
        return '';
    }

    // 解析框架: Vue
    if (compileVue) {
        compileList.push({el});
    }

    // 解析框架: Angular 1.x
    if (compileAngularjs) {
        compileList.push({el});
    }

    return template(settings);
};

/**
 * 解析: 通栏
 * @param settings
 * @param row
 * @param index
 * @param template
 * @returns {*}
 */
export const compileFullColumn = (settings, row, index, template, model) => {
    const { _, compileAngularjs, compileVue, compileReact } = settings;
    const compileList = getCompileList(_);

    let text = '';
    let compileAttr = '';

    // React element or React function
    // react 返回空字符串，将单元格内容交由react控制
    if (compileReact) {
        compileAttr = FRAMEWORK_KEY;
        compileList.push({template, row, index, type: 'full-' + model, fnArg: [row, index]});
    }

    // 解析框架: Angular 1.x || Vue
    if (compileVue || compileAngularjs) {
        compileAttr = FRAMEWORK_KEY;
        compileList.push({row, index});
    }

    // not React
    // 非react时，返回函数执行结果
    if (!compileReact) {
        text = template(row, index);
    }

    return {
        text,
        compileAttr
    };
};

/**
 * 发送
 * @param settings
 * @returns {Promise<void>}
 */
export async function sendCompile(settings) {
    const { _, compileAngularjs, compileVue, compileReact } = settings;
    const compileList = getCompileList(_);
    let domList = document.querySelectorAll(`${getQuerySelector(_)} [${FRAMEWORK_KEY}]`);
    if (compileList.length === 0) {
        return;
    }

    // 以下为框架版本才会使用到
    compileList.forEach((item, index) => {
        if (!item.el) {
            item.el = domList[index];
        }
    });

    // 解析框架: Vue
    if (compileVue) {
        await compileVue(compileList);

        // vue会改变domList 中的数据，导致在清除解析标识无法正常运行，所以需要再次更新domList
        domList = document.querySelectorAll(`${getQuerySelector(_)} [${FRAMEWORK_KEY}]`);
    }

    // 解析框架: Angular 1.x
    if (compileAngularjs) {
        await compileAngularjs(compileList);
    }

    // 解析框架: React
    if (compileReact) {
        await compileReact(compileList);
    }

    // 清除解析数据及标识
    [].forEach.call(domList, el => {
        el.removeAttribute(FRAMEWORK_KEY);
    });

    // 清除
    clearCompileList(_);
}
