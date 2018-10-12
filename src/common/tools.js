/**
 * jTool bind
 * @param option
 * @returns {Function}
 * @constructor
 */
export function BindEvent(option){
    return function (target, key, descriptor) {
        const oldValue = descriptor.value;
        descriptor.value = function($dom) {
            const _this = this;
            const _arguments = arguments;
            $dom.unbind(option.event);
            $dom.bind(option.event, function (event) {
                option.once && $dom.unbind(option.event);
                oldValue.call(_this, ..._arguments)(this, event);
            });
        };
    }
}

/**
 * jTool on
 * @param option
 * @returns {Function}
 * @constructor
 */
export function OnEvent(option){
    return (target, key, descriptor) => {
        const oldValue = descriptor.value;
        descriptor.value = function($dom) {
            const _this = this;
            const _arguments = arguments;
            $dom.off(option.event, option.target);
            $dom.on(option.event, option.target, function (event) {
                option.once && $dom.off(option.event, option.target);
                oldValue.call(_this, ..._arguments)(this, event);
            });
        };
    }
}
