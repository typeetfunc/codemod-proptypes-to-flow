import React from 'react';

type Props = {
  optionalArray?: Array<any>,
  optionalBool?: boolean,
  optionalFunc?: Function,
  optionalNumber?: number,
  optionalObject?: Object,
  optionalString?: string,
  optionalNode?: number | string | React.Element<any> | Array<number | string | React.Element<any>>,
  optionalElement?: React.Element<any>,
  optionalMessage?: Message,
  optionalEnum?: 'News' | 'Photos',
  optionalUnion?: string | number | Message,
  optionalArrayOf?: Array<number>,
  optionalObjectOf?: Object<number>,
  optionalObjectWithShape?: {
    color?: string,
    fontSize?: number,
  },
  requiredFunc: Function,
  requiredAny: any,
};

type DefaultProps = {
  optionalArray?: Array<any>,
  optionalBool?: boolean,
};

export default class Test extends React.Component {
  props: Props;
  static propTypes = {
    optionalArray: React.PropTypes.array,
    optionalBool: React.PropTypes.bool,
    optionalFunc: React.PropTypes.func,
    optionalNumber: React.PropTypes.number,
    optionalObject: React.PropTypes.object,
    optionalString: React.PropTypes.string,
    optionalNode: React.PropTypes.node,
    optionalElement: React.PropTypes.element,
    optionalMessage: React.PropTypes.instanceOf(Message),
    optionalEnum: React.PropTypes.oneOf(['News', 'Photos']),
    optionalUnion: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.instanceOf(Message)
    ]),
    optionalArrayOf: React.PropTypes.arrayOf(React.PropTypes.number),

    optionalObjectOf: React.PropTypes.objectOf(React.PropTypes.number),
    optionalObjectWithShape: React.PropTypes.shape({
      color: React.PropTypes.string,
      fontSize: React.PropTypes.number
    }),
    requiredFunc: React.PropTypes.func.isRequired,
    requiredAny: React.PropTypes.any.isRequired,
  };

  static defaultProps: DefaultProps = {
    optionalArray: [],
    optionalBool: false
  };

  constructor(props) {
    super(props);
  }
}
