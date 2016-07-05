import React, { PropTypes as pt } from 'react';
import { CommonPropTypes } from './CommonPropTypes';
const stage = pt.string.isRequired

class ComponentName extends React.Component {
    static defaultProps = {
        aaa: 'bbbb'
    }
    static propTypes = {
        aaa: stage,
        bbb: CommonPropTypes.children
    };
    render() {

    }
}

