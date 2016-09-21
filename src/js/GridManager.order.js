/*
 * GridManager: 序号
 * */
define(['cTool'], function($) {
    var orderGM = {
        /*
         @生成序号DOM
         $.table: table [jquery object]
         */
        initOrderDOM: function(table) {
            var _this = this;
            var orderHtml = '<th th-name="'+ _this.orderThName +'" gm-order="true" gm-create="true">'+ _this.i18nText('order-text') +'</th>';
            $('thead tr', table).prepend(orderHtml);
        }
    };
    return orderGM;
});