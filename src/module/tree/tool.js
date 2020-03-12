// tree唯一标识
export const treeKey = 'tree-element';

// 待添加tree dom存储器
const treeCacheMap = {};

// 待添加tree dom存储器: 获取
export const getTreeCache = _ => {
    return treeCacheMap[_];
};

// 待添加tree dom存储器: 追加
export const addTreeCache = (_, data) => {
    if (!treeCacheMap[_]) {
        treeCacheMap[_] = [];
    }
    treeCacheMap[_].push(data);
};

// 待添加tree dom存储器: 清除
export const clearTreeCache = _ => {
    delete treeCacheMap[_];
};

// 获取icon class name
export const getIconClass = state => {
    return state ? 'gm-icon-sub' : 'gm-icon-add';
};
