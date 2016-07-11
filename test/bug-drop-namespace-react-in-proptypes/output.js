/* @flow weak */
import React from 'react';

type Props = {
    threeCharCountry?: string,
    twoCharCountry?: string,
};

type DefaultProps = {
    threeCharCountry?: string,
    twoCharCountry?: string,
};

class UIComp extends React.Component {
    props: Props;
    static defaultProps: DefaultProps;

    static contextTypes = {
        getStore: React.PropTypes.func.isRequired
    };

    render() {
        return <div></div>;
    }
}

UIComp.propTypes = {
    threeCharCountry: React.PropTypes.string,
    twoCharCountry: React.PropTypes.string
};

UIComp.defaultProps = {
    threeCharCountry: '',
    twoCharCountry: '',
    size: '',
    noBorder: false
};

export default UIComp;