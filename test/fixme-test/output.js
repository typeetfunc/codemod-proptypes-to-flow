import React, { PropTypes as pt } from 'react';
import { CommonPropTypes } from './CommonPropTypes';

type Props = {
    aaa?: $FlowFixMe,
    bbb?: $FlowFixMe,
};

type DefaultProps = {aaa?: $FlowFixMe};
const stage = pt.string.isRequired

class ComponentName extends React.Component {
    props: Props;
    static defaultProps: DefaultProps = {
        aaa: 'bbbb'
    };
    static propTypes = {
        aaa: stage,
        bbb: CommonPropTypes.children
    };
    render() {

    }
}
