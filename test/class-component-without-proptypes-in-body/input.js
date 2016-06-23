import React, { PropTypes as pt } from 'react';

class ComponentName extends React.Component {
    render() {

    }
}
ComponentName.propTypes = {
    aaa: pt.string.isRequired
};

ComponentName.defaultProps = {
    aaa: 'bbbb'
}
