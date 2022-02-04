import React, { Component } from 'react';
import AppContext from './AppContext';

export default class FooterComponent extends Component {
    static contextType = AppContext;
    resetTable() {
        this.props.resetTable(true);
    }

    destroy() {
        this.props.resetTable(false);
    }

    render() {
        return (
            <div className="bottom-bar">
                <button onClick={this.resetTable.bind(this)}>init</button>
                <button onClick={this.destroy.bind(this)}>destroy</button>
            </div>
        );
    }
}
