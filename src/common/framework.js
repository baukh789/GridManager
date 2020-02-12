import { getQuerySelector } from '@common/base';
// 框架解析唯一值
const FRAMEWORK_KEY = 'data-compile-id';

// 解析存储容器
const compileMap = {};

/**
 * 获取当前表格解析列表
 * @param gridManagerName
 * @returns {*}
 */
export const getCompileList = gridManagerName => {
    if (!compileMap[gridManagerName]) {
        compileMap[gridManagerName] = [];
    }
    return compileMap[gridManagerName];
};

/**
 * 清空当前表格解析列表
 * @param gridManagerName
 */
export const clearCompileList = gridManagerName => {
    compileMap[gridManagerName] = [];
};

/**
 * 解析: fake thead
 * @param settings
 * @param el
 */
export const compileFakeThead = (settings, el) => {
    const { gridManagerName, compileAngularjs, compileVue, compileReact } = settings;
    if (compileAngularjs || compileVue || compileReact) {
        const compileList = getCompileList(gridManagerName);
        const thList = el.querySelectorAll(`[${FRAMEWORK_KEY}]`);
        [].forEach.call(thList, item => {
            const obj = compileList[item.getAttribute(FRAMEWORK_KEY)];
            item.setAttribute(FRAMEWORK_KEY, compileList.length);
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
    const { gridManagerName, compileAngularjs, compileVue, compileReact } = settings;
    const compileList = getCompileList(gridManagerName);
    let text = '';
    let compileAttr = '';
    if (template) {
        if (compileAngularjs || compileVue || compileReact) {
            compileAttr = `${FRAMEWORK_KEY}=${compileList.length}`;
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
    const { gridManagerName, compileAngularjs, compileVue, compileReact } = settings;
    const compileList = getCompileList(gridManagerName);

    let text = '';
    let compileAttr = '';
    if (template) {
        // React element or React function
        // react 返回空字符串，将单元格内容交由react控制
        if (compileReact) {
            compileAttr = `${FRAMEWORK_KEY}=${compileList.length}`;
            compileList.push({template, row, index, key, type: 'template', fnArg: [row[key], row, index, key]});
        }

        // 解析框架: Angular 1.x || Vue
        if (compileVue || compileAngularjs) {
            compileAttr = `${FRAMEWORK_KEY}=${compileList.length}`;
            compileList.push({row, index, key});
        }

        // not React
        // 非react时，返回函数执行结果
        if (!compileReact) {
            text = template(row[key], row, index, key);
        }
    } else {
        text = row[key];
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
    const { gridManagerName, compileAngularjs, compileVue, compileReact } = settings;
    const compileList = getCompileList(gridManagerName);
    // React
    if (compileReact) {
        compileList.push({el, template, type: 'empty'});
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

    return template();
};

/**
 * 解析: 通栏
 * @param settings
 * @param row
 * @param index
 * @param template
 * @returns {*}
 */
export const compileFullColumn = (settings, row, index, template) => {
    const { gridManagerName, compileAngularjs, compileVue, compileReact } = settings;
    const compileList = getCompileList(gridManagerName);

    let text = '';
    let compileAttr = '';

    // React element or React function
    // react 返回空字符串，将单元格内容交由react控制
    if (compileReact) {
        compileAttr = `${FRAMEWORK_KEY}=${compileList.length}`;
        compileList.push({template, row, index, type: 'full', fnArg: [row, index]});
    }

    // 解析框架: Angular 1.x || Vue
    if (compileVue || compileAngularjs) {
        compileAttr = `${FRAMEWORK_KEY}=${compileList.length}`;
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
 * @param isRunElement: 是否通过属性更新element
 * @returns {Promise<void>}
 */
export async function sendCompile(settings, isRunElement) {
    const { gridManagerName, compileAngularjs, compileVue, compileReact } = settings;
    const compileList = getCompileList(gridManagerName);
    if (compileList.length === 0) {
        return;
    }

    if (isRunElement) {
        compileList.forEach((item, index) => {
            item[FRAMEWORK_KEY] = index;
            item.el = document.querySelector(`${getQuerySelector(gridManagerName)} [${FRAMEWORK_KEY}="${index}"]`);
        });
    }

    // 解析框架: Vue
    if (compileVue) {
        await compileVue(compileList);
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
    compileList.forEach(item => {
        [].forEach.call(document.querySelectorAll(`${getQuerySelector(gridManagerName)} [${FRAMEWORK_KEY}="${item[FRAMEWORK_KEY]}"]`), el => {
            el.removeAttribute(FRAMEWORK_KEY);
        });
    });

    // 清除
    clearCompileList(gridManagerName);
}
