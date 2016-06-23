import React, { PropTypes as pt } from 'react';

type Props = {aaa: string};
type DefaultProps = {aaa: string};

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
