// tree唯一标识
export const treeKey = 'tree-element';

// 待添加tree dom存储器
const treeCacheMap = {};

// 待添加tree dom存储器: 获取
export const getTreeCache = gridManagerName => {
    return treeCacheMap[gridManagerName];
};

// 待添加tree dom存储器: 追加
export const addTreeCache = (gridManagerName, data) => {
    if (!treeCacheMap[gridManagerName]) {
        treeCacheMap[gridManagerName] = [];
    }
    treeCacheMap[gridManagerName].push(data);
};

// 待添加tree dom存储器: 清除
export const clearTreeCache = gridManagerName => {
    delete treeCacheMap[gridManagerName];
};

// 获取icon class name
export const getIconClass = state => {
    return state ? 'gm-icon-sub' : 'gm-icon-add';
};
