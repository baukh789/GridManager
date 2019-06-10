
class Framework {
    // 解析存储容器
    compileList = [];

    // 框架解析唯一值
    getKey(gridManagerName) {
        return `data-compile-id-${gridManagerName || ''}`;
    }

    /**
     * 解析: fake thead
     * @param settings
     * @param el
     */
    compileFakeThead(settings, el) {
        const compileList = this.compileList;
        if (settings.compileAngularjs || settings.compileVue || settings.compileReact) {
            const thList = el.querySelectorAll(`[${this.getKey(settings.gridManagerName)}]`);
            [].forEach.call(thList, item => {
                const obj = compileList[item.getAttribute(`${this.getKey(settings.gridManagerName)}`)];
                item.setAttribute(`${this.getKey(settings.gridManagerName)}`, compileList.length);
                compileList.push({...obj});
            });
        }
    }

    /**
     * 解析: th
     * @param settings
     * @param template
     * @returns {string}
     */
    compileTh(settings, template) {
        let compileAttr = '';
        if (settings.compileAngularjs || settings.compileVue || settings.compileReact) {
            compileAttr = `${this.getKey(settings.gridManagerName)}=${this.compileList.length}`;
            this.compileList.push({template});
        }

        return compileAttr;
    }

    /**
     * 解析: td
     * @param settings
     * @param el
     * @param row
     * @param index
     * @param key
     * @param template
     * @returns {*}
     */
    compileTd(settings, el, row, index, key, template) {
        // React and not template
        if (settings.compileReact && !template) {
            return row[key];
        }

        // React element or function
        if (settings.compileReact) {
            this.compileList.push({el, template, row, index, fnArg: [row[key], row, index]});
            return '';
        }

        // 解析框架: Vue
        if (settings.compileVue) {
            this.compileList.push({el, row, index});
        }

        // 解析框架: Angular 1.x
        if (settings.compileAngularjs) {
            this.compileList.push({el, row, index});
        }

        // not React
        if (!settings.compileReact) {
            return typeof template === 'function' ? template(row[key], row, index) : (typeof template === 'string' ? template : row[key]);
        }
    }

    /**
     * 解析: 空模板
     * @param settings
     * @param el
     * @param template
     * @returns {string}
     */
    compileEmptyTemplate(settings, el, template) {
        // React
        if (settings.compileReact) {
            this.compileList.push({el, template});
            return '';
        }

        // 解析框架: Vue
        if (settings.compileVue) {
            this.compileList.push({el});
        }

        // 解析框架: Angular 1.x
        if (settings.compileAngularjs) {
            this.compileList.push({el});
        }
    }

    /**
     * 解析: 通栏
     * @param settings
     * @param el
     * @param row
     * @param index
     * @param template
     * @returns {*}
     */
    compileFullColumn(settings, el, row, index, template) {
        const compileList = this.compileList;
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
            compileList.push({el, template, row, index, fnArg: [row, index]});
            return '';
        }

        // 解析框架: Vue
        if (settings.compileVue) {
            compileList.push({el, row, index});
        }

        // 解析框架: Angular 1.x
        if (settings.compileAngularjs) {
            compileList.push({el, row, index});
        }

        // not react
        return typeof template === 'function' ? template(row, index) : template;
    }

    /**
     * 发送
     * @param settings
     * @param isRunElement: 是否通过属性更新element
     * @returns {Promise<void>}
     */
    async send(settings, isRunElement) {
        const compileList = this.compileList;
        if (compileList.length === 0) {
            return;
        }
        if (isRunElement) {
            compileList.forEach((item, index) => {
                item.el = document.querySelector(`[${this.getKey(settings.gridManagerName)}="${index}"]`);
            });
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

            // 清除解析数据及标识
            compileList.forEach(item => {
                item.el.removeAttribute(`${this.getKey(settings.gridManagerName)}`);
            });

            compileList.length = 0;
        } catch (err) {
            this.outError(`parse framework template error。${err}`);
        }
    }
}

export default new Framework();
