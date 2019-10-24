// tree唯一标识
export const treeKey = 'tree-element';

// 待添加tree dom存储器
export const treeCacheMap = {};

// 获取icon class name
export const getIconClass = state => {
    return state ? 'icon-jianhao' : 'icon-add';
};
