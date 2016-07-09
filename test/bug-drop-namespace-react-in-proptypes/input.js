import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import mixin from '../../../../utils/decorators/mixinComponent';
import WatchStoresMixin from '../../../mixins/WatchStoresMixin';


import './ui-flag.less';

@mixin(WatchStoresMixin(
    'countries'
))
class UIFlag extends React.Component {

    static contextTypes = {
        getStore: React.PropTypes.func.isRequired
    };

    render() {
        return <div className={classNames({
            'ui-flag': true,
            [`ui-flag_${threeCharCountry.toLowerCase()}`]: true,
            [`ui-flag_size_${this.props.size}`]: this.props.size,
            'ui-flag_borderless': this.props.noBorder,
            [this.props.className]: this.props.className
        })}></div>;
    }
}

UIFlag.propTypes = {
    threeCharCountry: React.PropTypes.string,
    twoCharCountry: React.PropTypes.string
};

UIFlag.defaultProps = {
    threeCharCountry: '',
    twoCharCountry: '',
    size: '',
    noBorder: false
};

export default UIFlag;
