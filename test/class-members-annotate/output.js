import React, { PropTypes as pt } from 'react';

type Props = {aaa: string};
type DefaultProps = {aaa: string};

class ComponentName extends React.Component {
    props: Props;
    state: $FlowFixMe;
    anything: Function;
    somethingProp: $FlowFixMe;
    static defaultProps: DefaultProps = {
        aaa: 'bbbb'
    };
    static propTypes = {
        aaa: pt.string.isRequired
    };

    doSomething() {
        this.somethingProp ? this.anything() : 111
    }

    render() {
        return this.state.vdom;
    }
}
