import 'jtool';
let jTool = window.jTool;

window.jTool === window.$ && delete window.$;
delete window.jTool;
export default jTool;
