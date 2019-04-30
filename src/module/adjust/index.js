/*
 * adjust: 宽度调整
 * 宽度调整是通过 jTool 进行的事件绑定
 */
import './style.less';
import jTool from '@common/jTool';
import base from '@common/base';
import { FAKE_TABLE_HEAD_KEY, NO_SELECT_CLASS_NAME } from '@common/constants';
import cache from '@common/cache';
import getAdjustEvent from './event';

class Adjust {
    eventMap = {};

    /**
     * 宽度调整HTML
     * @returns {string}
     */
    get html() {
        return '<span class="adjust-action"></span>';
    }

    get selectedClassName() {
        return 'adjust-selected';
    }

    /**
     * init
     * 绑定宽度调整事件
     * @param: gridManagerName
     */
    init(gridManagerName) {
        const _this = this;

        // 监听鼠标调整列宽度
        this.$body = jTool('body');
        this.eventMap[gridManagerName] = getAdjustEvent(gridManagerName, base.getQuerySelector(gridManagerName));

        const { events, selector } = this.eventMap[gridManagerName].adjustStart;
        this.$body.on(events, selector, function (event) {
            const _dragAction = jTool(this);
            // 事件源所在的th
            let $th = _dragAction.closest('th');

            // 事件源所在的table
            let	$table = base.getTable(gridManagerName);

            // 当前存储属性
            const { adjustBefore, adjustAfter, isIconFollowText } = cache.getSettings(gridManagerName);

            // 事件源同层级下的所有th
            let	$allTh = base.getFakeVisibleTh(gridManagerName);

            // 事件源下一个可视th
            let	$nextTh = $allTh.eq($th.index($allTh) + 1);

            // 存储与事件源同列的所有td
            let	$td = base.getColTd($th);

            // 宽度调整触发回调事件
            adjustBefore(event);

            // 增加宽度调整中样式
            $th.addClass(_this.selectedClassName);
            $td.addClass(_this.selectedClassName);

            // 禁用文本选中
            $table.addClass(NO_SELECT_CLASS_NAME);

            // 执行移动事件
            _this.__runMoveEvent(gridManagerName, $th, $nextTh, isIconFollowText);

            // 绑定停止事件
            _this.__runStopEvent(gridManagerName, $table, $th, $td, adjustAfter);
            return false;
        });

        this.resetAdjust(gridManagerName);
    }

    /**
     * 通过缓存配置成功后, 重置宽度调整事件源dom 用于禁用最后一列调整宽度事件
     * @param gridManagerName
     * @returns {boolean}
     */
    resetAdjust(gridManagerName) {
        let _thList = jTool(`thead[${FAKE_TABLE_HEAD_KEY}="${gridManagerName}"] [th-visible="visible"]`);
        let	_adjustAction = jTool('.adjust-action', _thList);
        if (!_adjustAction || _adjustAction.length === 0) {
            return false;
        }
        _adjustAction.show();
        _adjustAction.eq(_adjustAction.length - 1).hide();
    }

    /**
     * 执行移动事件
     * @param gridManagerName
     * @param $th
     * @param $nextTh
     * @param isIconFollowText: 表头的icon图标是否跟随文本
     * @private
     */
    __runMoveEvent(gridManagerName, $th, $nextTh, isIconFollowText) {
        let _thWidth = null;
        let	_NextWidth = null;
        let _thMinWidth = base.getThTextWidth(gridManagerName, $th, isIconFollowText);
        let	_NextThMinWidth = base.getThTextWidth(gridManagerName, $nextTh, isIconFollowText);
        const { events, selector } = this.eventMap[gridManagerName].adjusting;
        this.$body.off(events, selector);
        this.$body.on(events, selector, function (event) {
            _thWidth = event.clientX - $th.offset().left;
            _thWidth = Math.ceil(_thWidth);
            _NextWidth = $nextTh.width() + $th.width() - _thWidth;
            _NextWidth = Math.ceil(_NextWidth);
            // 达到最小值后不再执行后续操作
            if (_thWidth < _thMinWidth) {
                return;
            }
            if (_NextWidth < _NextThMinWidth) {
                _NextWidth = _NextThMinWidth;
            }

            // 验证是否更改
            if (_thWidth === $th.width()) {
                return;
            }

            // 验证宽度是否匹配
            if (_thWidth + _NextWidth < $th.width() + $nextTh.width()) {
                _NextWidth = $th.width() + $nextTh.width() - _thWidth;
            }
            $th.width(_thWidth);
            $nextTh.width(_NextWidth);

            // 当前宽度调整的事件原为表头置顶的thead th
            // 修改与置顶thead 对应的 thead
            if ($th.closest(`thead[${FAKE_TABLE_HEAD_KEY}]`).length === 1) {
                base.getTh(gridManagerName, $th).width(_thWidth);
                base.getTh(gridManagerName, $nextTh).width(_NextWidth);
                base.getFakeThead(gridManagerName).width(base.getThead(gridManagerName).width());
            }
        });
    }

    /**
     * 绑定鼠标放开、移出事件
     * @param gridManagerName
     * @param $table
     * @param $th
     * @param $td
     * @param adjustAfter
     * @private
     */
    __runStopEvent(gridManagerName, $table, $th, $td, adjustAfter) {
        const stopEventName = 'mouseup mouseleave';
        $table.unbind(stopEventName);
        $table.bind(stopEventName, event => {
            const adjusting = this.eventMap[gridManagerName].adjusting;
            $table.unbind(stopEventName);
            this.$body.off(adjusting.events, adjusting.selector);

            // 宽度调整成功回调事件
            if ($th.hasClass(this.selectedClassName)) {
                adjustAfter(event);
            }
            $th.removeClass(this.selectedClassName);
            $td.removeClass(this.selectedClassName);
            $table.removeClass(NO_SELECT_CLASS_NAME);

            // 更新滚动轴状态
            base.updateScrollStatus(gridManagerName);

            // 更新存储信息
            cache.update(gridManagerName);
        });
    }

    /**
     * 消毁
     * @param gridManagerName
     */
    destroy(gridManagerName) {
        base.clearBodyEvent(this.eventMap[gridManagerName]);
    }
}
export default new Adjust();
