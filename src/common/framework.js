// 框架解析唯一值
const COMPILE_ID = 'data-compile-id';
const compileList = [];

// 1. th text
// 2. 空模板
// 3. 通栏
// 4. 每一个td || tr
const compileTh = (settings, col) => {
    let compileAttr = '';
    const template = col.text;
    if (typeof template === 'string') {
        return compileAttr;
    }

    // React
    if (settings.compileReact) {
        compileAttr = `${COMPILE_ID}-${settings.gridManagerName}=${compileList.length}`;
        compileList.push({template});
    }

    return compileAttr;
};
const compileThead = (settings, el) => {
    // 解析框架: Vue
    if (settings.compileVue) {
        compileList.push({el});
    }

    // 解析框架: Angular 1.x
    if (settings.compileAngularjs) {
        compileList.push({el});
    }
};

const compileTd = (settings, element, row, index, key, template) => {
    // 无模板
    if (!template) {
        return row[key];
    }

    // 模板为为符串
    if (typeof template === 'string') {
        return template;
    }

    // React element or function
    if (settings.compileReact) {
        element.setAttribute(COMPILE_ID, compileList.length);
        compileList.push({template, cell: row[key], row, index, fnArg: [row[key], row, index]});
        return '';
    }

    // 解析框架: Vue
    if (settings.compileVue) {
        compileList.push({el: element, row, index});
    }

    // 解析框架: Angular 1.x
    if (settings.compileAngularjs) {
        compileList.push({el: element, row, index});
    }

    // not React
    if (!settings.compileReact) {
        return typeof template === 'function' ? template(row[key], row, index) : row[key];
    }
};

const compileEmptyTemplate = (settings, trNode, template) => {
    // React
    if (settings.compileReact) {
        trNode.querySelector('td').setAttribute(COMPILE_ID, compileList.length);
        compileList.push({template});
        return '';
    }

    // 解析框架: Vue
    if (settings.compileVue) {
        compileList.push({el: trNode});
    }

    // 解析框架: Angular 1.x
    if (settings.compileAngularjs) {
        compileList.push({el: trNode});
    }
};

const compileFullColumn = (settings, element, row, index, template) => {
    // 无模板
    if (!template) {
        return '';
    }

    // 模板为为符串
    if (typeof template === 'string') {
        return template;
    }

    // React element or function
    if (settings.compileReact) {
        element.querySelector('.full-column-td').setAttribute(COMPILE_ID, compileList.length);
        compileList.push({template, row, index, fnArg: [row, index]});
        return '';
    }

    // 解析框架: Vue
    if (settings.compileVue) {
        compileList.push({el: element});
    }

    // 解析框架: Angular 1.x
    if (settings.compileAngularjs) {
        compileList.push({el: element});
    }

    // not react
    return typeof template === 'function' ? template(row, index) : template;
};

const send = async settings => {
    if (compileList.length === 0) {
        return;
    }
    try {
        // 解析框架: Vue
        if (settings.compileVue) {
            await settings.compileVue(compileList);
        }

        // 解析框架: Angular 1.x
        if (settings.compileAngularjs) {
            await settings.compileAngularjs(compileList);
        }

        // 解析框架: React
        if (settings.compileReact) {
            await settings.compileReact(compileList);
        }
        compileList.length = 0;
    } catch (err) {
        this.outError(`parse framework template error。${err}`);
    }
};


export default {
    compileThead,
    compileTh,
    compileTd,
    compileEmptyTemplate,
    compileFullColumn,
    send
};
