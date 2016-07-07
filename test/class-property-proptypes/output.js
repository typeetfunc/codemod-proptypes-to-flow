import React from 'react';

type Props = {
  optionalArray?: Array<any>,
  optionalBool?: boolean,
  optionalFunc?: Function,
  optionalNumber?: number,
  optionalObject?: Object,
  optionalString?: string,
  optionalNode?: number | string | React.Element | Array<any>,
  optionalElement?: React.Element,
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
    optionalArray: PropTypes.array,
    optionalBool: PropTypes.bool,
    optionalFunc: PropTypes.func,
    optionalNumber: PropTypes.number,
    optionalObject: PropTypes.object,
    optionalString: PropTypes.string,
    optionalNode: PropTypes.node,
    optionalElement: PropTypes.element,
    optionalMessage: PropTypes.instanceOf(Message),
    optionalEnum: PropTypes.oneOf(['News', 'Photos']),
    optionalUnion: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Message)
    ]),
    optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

    optionalObjectOf: PropTypes.objectOf(PropTypes.number),
    optionalObjectWithShape: PropTypes.shape({
      color: PropTypes.string,
      fontSize: PropTypes.number
    }),
    requiredFunc: PropTypes.func.isRequired,
    requiredAny: PropTypes.any.isRequired,
  };

  static defaultProps: DefaultProps = {
    optionalArray: [],
    optionalBool: false
  };

  constructor(props) {
    super(props);
  }
}
