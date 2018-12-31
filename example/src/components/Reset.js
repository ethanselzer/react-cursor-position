import React from 'react';
import debounce from 'lodash.debounce';
import ReactCursorPosition from '../pkg-lnk/ReactCursorPosition';
import PositionLabel from './PositionLabel';
import '../styles/reset.css';

export default class extends React.Component {

    reset = debounce(
        () => {
            this.rcp.reset();
        },
        250,
        {
            leading: false,
            trailing: true
        }
    )

    render() {
        return (
            <div
                className="scroll"
                onScroll={this.reset}
            >
                <ReactCursorPosition
                    className="reset example__target example__target--basic"
                    ref={(rcp) => this.rcp = rcp }
                >
                    {(cursorProps) => (
                        <div>
                            <div id="spacer" style={{height: '145px'}} />
                            <PositionLabel {...cursorProps} />
                        </div>
                    )}
                </ReactCursorPosition>
            </div>
        );
    }
}
