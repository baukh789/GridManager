import React, { useState } from 'react';
import GridManager from '../js/index.js';
import AppContext from './AppContext';

export default function SearchComponent(props) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { onAddCol, onRemoveCol } = props;

    function setQuery(gridManagerName) {
        GridManager.setQuery(gridManagerName, {title, content});
    }

    function reset() {
        setTitle('');
        setContent('');
    }
    return (
        <AppContext.Consumer>
            {({gridManagerName}) => (
                <div className="search-area">
                    <div className="sa-ele">
                        <label className="se-title">名称:</label>
                        <input className="se-con" value={title} onChange={event => setTitle(event.target.value)}/>
                    </div>
                    <div className="sa-ele">
                        <label className="se-title">内容:</label>
                        <input className="se-con" value={content} onChange={event => setContent(event.target.value)}/>
                    </div>
                    <div className="sa-ele">
                        <button className="search-action" onClick={() => setQuery(gridManagerName)}>搜索</button>
                        <button className="reset-action" onClick={() => reset()}>重置</button>
						<button className="add-col" onClick={() => {onAddCol()}}>增加列: ID</button>
						<button className="del-col" onClick={() => {onRemoveCol()}}>删除列: 博文分类</button>
                    </div>
                </div>
            )}
        </AppContext.Consumer>
    );
}
