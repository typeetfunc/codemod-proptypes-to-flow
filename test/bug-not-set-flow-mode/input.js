import React, { Component, PropTypes as pt } from 'react';
import url from 'url';
import { pathOr } from 'ramda';

const
    InitialState =
        props =>
            <script
                dangerouslySetInnerHTML={{
                    __html: 'var initialState=' + JSON.stringify(props.dehydrate())
                }}
                nonce={props.cspToken}
            ></script>,
    metaPath = content => key => pathOr('', ['meta', 'fields', key, 'value'])(content);

InitialState.propTypes = {
    dehydrate: pt.func.isRequired,
    cspToken: pt.string
};

export default class Application extends Component {

    static propTypes = {
        cspToken: pt.string,
        context: pt.object.isRequired,
        dehydrate: pt.func.isRequired,
        content: pt.func.isRequired
    };

    render() { // eslint-disable-line complexity
    }
}
