import React, { Component, PropTypes as pt } from 'react';
import { pathOr } from 'ramda';

const
    InitialState =
        props =>
            <script></script>,
    meta = content => key => pathOr('', ['fields'])(content);

InitialState.propTypes = {
    dehydrate: pt.func.isRequired,
    cspToken: pt.string
};

export default class TestApp extends Component {

    static propTypes = {
        cspToken: pt.string,
        context: pt.object.isRequired,
        dehydrate: pt.func.isRequired,
        content: pt.func.isRequired
    };

    render() { // eslint-disable-line complexity
    }
}
