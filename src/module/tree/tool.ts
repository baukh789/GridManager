// 树的存储结构
interface TreeCache {
	cacheKey: string;
	level: number;
	hasChildren: boolean;
}

// tree唯一标识
export const treeKey = 'tree-element';

// 待添加tree dom存储器
const treeCacheMap = {};

// 待添加tree dom存储器: 获取
export const getTreeCache = (_: string): Array<TreeCache> => {
    return treeCacheMap[_];
};

// 待添加tree dom存储器: 追加
export const addTreeCache = (_: string, data: TreeCache): void => {
    if (!treeCacheMap[_]) {
        treeCacheMap[_] = [];
    }
    treeCacheMap[_].push(data);
};

// 待添加tree dom存储器: 清除
export const clearTreeCache = (_: string): void => {
    delete treeCacheMap[_];
};

// 获取icon class name
export const getIconClass = (state: boolean): string => {
    return state ? 'gm-icon-sub' : 'gm-icon-add';
};
