import { COMPILE_ID } from '@common/constants';
const compileTh = (settings, col) => {
    let thText = col.text;
    let reactAttr = '';
    if (settings.compileReact) {
        thText = '';
        reactAttr = `${COMPILE_ID}=${settings.compileList.length}`;
        settings.compileList.push({el: col.text, row: {}});
    }
    return {thText, reactAttr};
};
const compileList = [];
const compileTemplate = (settings, element, row, index, key, template) => {
    // Vue
    if (typeof settings.compileVue === 'function') {
    }

    // Angular 1.x
    if (typeof settings.compileAngularjs === 'function') {
    }

    // React
    if (typeof settings.compileReact === 'function') {
        element.setAttribute(COMPILE_ID, this.compileList.length);
        compileList.push({el: template, cell: row[key], row: row, index});
        return '';
    }
    return typeof template === 'function' ? template(row[key], row, index) : (typeof template === 'string' ? template : row[key]);
};
export default {
    compileTh,
    compileTemplate
};
