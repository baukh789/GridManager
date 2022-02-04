import React, { useState } from 'react';
import GridManager from '../js/index.js';
import AppContext from './AppContext';

export default function SearchComponent() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

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
                    </div>
                </div>
            )}
        </AppContext.Consumer>
    );
}
