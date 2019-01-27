/*
 * adjust: 宽度调整
 * */
import { jTool, base, cache } from '../../common';
class Adjust {
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
     * @param: table [jTool object]
     */
    init($table) {
        const _this = this;
        // 监听鼠标调整列宽度
        $table.off('mousedown', '.adjust-action');
        $table.on('mousedown', '.adjust-action', function (event) {
            const _dragAction = jTool(this);
            // 事件源所在的th
            let $th = _dragAction.closest('th');

            // 事件源所在的tr
            let $tr = $th.parent();

            // 事件源所在的table
            let	_$table = $tr.closest('table');

            // 当前存储属性
            const { adjustBefore, isIconFollowText } = cache.getSettings(_$table);

            // 事件源同层级下的所有th
            let	_allTh = $tr.find('th[th-visible="visible"]');

            // 事件源下一个可视th
            let	$nextTh = _allTh.eq($th.index(_allTh) + 1);

            // 存储与事件源同列的所有td
            let	$td = base.getColTd($th);

            // 宽度调整触发回调事件
            adjustBefore(event);

            // 增加宽度调整中样式
            $th.addClass(_this.selectedClassName);
            $td.addClass(_this.selectedClassName);

            // 更新界面交互标识
            base.updateInteractive(_$table, 'adjust');

            // 执行移动事件
            _this.__runMoveEvent(_$table, $th, $nextTh, isIconFollowText);

            // 绑定停止事件
            _this.__runStopEvent(_$table, $th, $td);
            return false;
        });
    }

    /**
     * 通过缓存配置成功后, 重置宽度调整事件源dom 用于禁用最后一列调整宽度事件
     * @param $table
     * @returns {boolean}
     */
    resetAdjust($table) {
        if (!$table || $table.length === 0) {
            return false;
        }
        let _thList = jTool(`thead[${base.fakeTableHeadKey}] [th-visible="visible"]`, $table);
        let	_adjustAction = jTool('.adjust-action', _thList);
        if (!_adjustAction || _adjustAction.length === 0) {
            return false;
        }
        _adjustAction.show();
        _adjustAction.eq(_adjustAction.length - 1).hide();

        // 更新滚动轴状态
        base.updateScrollStatus($table);
    }

    /**
     * 消毁
     * @param $table
     */
    destroy($table) {
        // 清理: 鼠标放开、移出事件
        $table.unbind('mouseup mouseleave');

        // 清理: 移动事件
        $table.unbind('mousemove');

        // 清理: 宽度调整事件
        $table.off('mousedown', '.adjust-action');
    }

    /**
     * 执行移动事件
     * @param $table
     * @param $th
     * @param $nextTh
     * @param isIconFollowText: 表头的icon图标是否跟随文本
     * @private
     */
    __runMoveEvent($table, $th, $nextTh, isIconFollowText) {
        let _thWidth = null;
        let	_NextWidth = null;
        let _thMinWidth = base.getTextWidth($th, isIconFollowText);
        let	_NextThMinWidth = base.getTextWidth($nextTh, isIconFollowText);
        $table.unbind('mousemove');
        $table.bind('mousemove', event => {
            $table.addClass('no-select-text');
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
            if ($th.closest(`thead[${base.fakeTableHeadKey}]`).length === 1) {
                base.getTh($table, $th).width(_thWidth);
                base.getTh($table, $nextTh).width(_NextWidth);
                base.getFakeHead($table).width(base.getHead($table).width());
            }
        });
    }

    /**
     * 绑定鼠标放开、移出事件
     * @param $table
     * @param $th
     * @param $td
     * @private
     */
    __runStopEvent($table, $th, $td) {
        $table.unbind('mouseup mouseleave');
        $table.bind('mouseup mouseleave', event => {
            const settings = cache.getSettings($table);
            $table.unbind('mousemove mouseleave');

            // 其它操作也在table以该事件进行绑定,所以通过class进行区别
            if ($th.hasClass(this.selectedClassName)) {
                // 宽度调整成功回调事件
                settings.adjustAfter(event);
            }
            $th.removeClass(this.selectedClassName);
            $td.removeClass(this.selectedClassName);
            $table.removeClass('no-select-text');

            // 更新界面交互标识
            base.updateInteractive($table);

            // 更新滚动轴状态
            base.updateScrollStatus($table);

            // 更新存储信息
            cache.update($table, settings);
        });
    }
}
export default new Adjust();
