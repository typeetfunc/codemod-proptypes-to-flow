# codemod-proptypes-to-flow
Convert `React.PropTypes` to [Flow](http://flowtype.org/).

### Setup & Run
  * `git clone -b dist https://github.com/typeetfunc/jscodeshift.git`
  * `git clone https://github.com/billyvg/codemod-proptypes-to-flow` 
  * `./jscodeshift/bin/jscodeshift.sh -t ./codemod-proptypes-to-flow/lib/index.js <jscodeshift-options> <path-of-project> <codemod-options>`

### Options
  * `annotationToFile` - place Flow annotation to separate file in same folder. Default is `false`
  * `removePropTypes` - remove original propTypes from file. Default `false`.
  * `setFlowMode` - if this options one of `strict`, `weak`, `no`, then codemod add to files corresponding flow comment. Unset by default.


### Not working/Implemented yet
  * Custom validators
  * `React.createClass`
  * external PropTypes
