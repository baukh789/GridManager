/**
 * jTool
 * 由于jTool导入后是直接挂载在window上的，为了防止项目中污染window对象，所以在这里将jTool从window上清除并返回。
 */
import 'jtool';
let jTool = window.jTool;

window.jTool === window.$ && delete window.$;
// delete window.jTool;
export default jTool;
