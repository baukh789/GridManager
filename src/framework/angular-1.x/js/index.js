import controller from './controller';
import $gridManager, { jTool } from '../../../module/index';
// import 'gridmanager/css/gm.css';

const template = '<table></table>';
const GridManagerComponent = {
    controller,
    template,
    controllerAs: 'vm',
    bindings: {
        option: '<',
        callback: '&'
    }
};
// angular 1.x 无论哪种引入方式都会向 window上挂载，所以可以直接使用window.angular
const gridManagerModuel = window.angular.module('gridManager', []);

let name = gridManagerModuel
    .component('gridManager', GridManagerComponent)
    .value('$gridManager', $gridManager)
    .value('$jTool', jTool)
    .name;

gridManagerModuel.version = process.env.VERSION;

export { $gridManager, jTool };
export default name;
