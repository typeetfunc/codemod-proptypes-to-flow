describe('React.PropTypes to flow', () => {/*
  it('transforms optional PropTypes prefixed with `React`', () => {
    test('simple-class-component');
  });
  it('transforms optional PropTypes prefixed with `React`', () => {
    test('class-component-without-proptypes-in-body');
  });
*/
  it('transforms optional PropTypes prefixed with `React`', () => {
    test('export-annotation',
        {annotationToFile: true},
        {
            path: '/home/folder/projects/project/components/UIInput.jsx',
            annotationFilePath: '/home/folder/projects/project/components/UIInput.flow.jsx'
        }
    );
  });

  it('transforms required PropTypes prefixed with `React`', () => {
    test('react-required-proptypes');
  });

  it('transforms optional PropTypes with no `React` prefix', () => {
    test('optional-proptypes');
  });

  it('transforms required PropTypes with no `React` prefix', () => {
    test( 'required-proptypes');
  });

  it('transforms PropTypes that are a class property', () => {
    test('class-property-proptypes');
  });

  it('transforms PropTypes that are fined outside of class definition', () => {
    test('member-proptypes');
  });

  it('Adds type annotation to `prop` parameter in constructor (ES2015)', () => {
    test('constructor-and-class-member-annotation');
  });
*/
});
