import React, { Component, PropTypes as pt } from 'react';

type Props = {
    context?: Object,
    clientRouting?: boolean,
    className?: string,
    onClick?: Function,
    children?: number | string | React.Element | Array<any>,
    target?: string,
};

type DefaultProps = {onClick?: Function};

export default class TestLink extends Component {
    props: Props;
    static defaultProps: DefaultProps;
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