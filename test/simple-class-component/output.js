import React, { PropTypes as pt } from 'react';

type Props = {aaa: string};
type DefaultProps = {aaa: string};

class ComponentName extends React.Component {
    props: Props;
    static defaultProps: DefaultProps = {
        aaa: 'bbbb'
    };
    static propTypes = {
        aaa: pt.string.isRequired
    };
    render() {

    }
}

