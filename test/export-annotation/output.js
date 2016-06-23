/* @flow */
import React, { PropTypes as pt } from 'react';

import type {Props, DefaultProps} from './UIInput.flow.jsx';

class ComponentName extends React.Component {
    props: Props;
    static defaultProps: DefaultProps;
    render() {

    }
}
ComponentName.propTypes = {
    aaa: pt.string.isRequired
};

ComponentName.defaultProps = {
    aaa: 'bbbb'
}