import React, { Component, PropTypes as pt } from 'react';

export default class TestLink extends Component {
    static propTypes = {
        context: pt.object,
        clientRouting: pt.bool,
        className: pt.string,
        onClick: pt.func,
        children: pt.node,
        target: pt.string
    };

    render() {
        return <a>          
            {this.props.children}
        </a>;
    }
}

TestLink.propTypes = {
    href: React.PropTypes.string,
    params: React.PropTypes.object
};

TestLink.defaultProps = {

    href: '',
    params: {},
    onClick: emptyFunction
};
