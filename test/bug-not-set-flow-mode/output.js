/* @flow weak */
import React, {Component, PropTypes as pt} from 'react';
import {pathOr} from 'ramda';

type TestAppProps = {
    cspToken?: string,
    context: Object,
    dehydrate: Function,
    content: Function,
};

type InitialStateProps = {
    dehydrate: Function,
    cspToken?: string,
};

const InitialState = (props: InitialStateProps) => <script></script>, meta = (content) => (key) => pathOr('', ['fields'])(content);

InitialState.propTypes = {
    dehydrate: pt.func.isRequired,
    cspToken: pt.string
};

export default class TestApp extends Component {
    props: TestAppProps;

    static propTypes = {
        cspToken: pt.string,
        context: pt.object.isRequired,
        dehydrate: pt.func.isRequired,
        content: pt.func.isRequired
    };

    render() {}
}