import React from 'react';

class UIComp extends React.Component {

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
