import React, { PropTypes as pt } from 'react';

class ComponentName extends React.Component {
    static defaultProps = {
        aaa: 'bbbb'
    }
    static propTypes = {
        aaa: pt.string.isRequired
    };
    render() {

    }
}

