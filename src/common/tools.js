export function Bind(option){
    return function (target, key, descriptor) {
        const oldValue = descriptor.value;
        descriptor.value = function($dom) {
            const _this = this;
            $dom.off(option.event, option.target);
            $dom.on(option.event, option.target, function (event) {
                oldValue.call(_this, this, event);
            });
        };
    }
}
