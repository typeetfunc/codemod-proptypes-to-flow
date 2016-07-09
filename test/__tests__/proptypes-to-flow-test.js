describe('React.PropTypes to flow', () => {
  it('transforms optional PropTypes prefixed with `React`', () => {
    test('simple-class-component');
  });

  it('transforms optional PropTypes prefixed with `React`', () => {
    test('class-component-without-proptypes-in-body');
  });

  it('transforms optional PropTypes prefixed with `React`', () => {
    test('class-property-proptypes');
  });

  it('transforms functional component', () => {
    test('functional-component');
  });

  it('transforms functional component', () => {
    test('member-proptypes');
  });

  it('transforms functional component', () => {
    test('proptypes-to-flow-test');
  });

  it('transforms optional PropTypes prefixed with `React`', () => {
    test('export-annotation',
        {annotationToFile: true, setFlowMode: 'strict' },
        {
            path: '/home/folder/projects/project/components/UIInput.jsx',
            annotationFilePath: '/home/folder/projects/project/components/UIInput.flow.jsx'
        }
    );
  });
    it('transforms optional PropTypes prefixed with `React`', () => {
    test('export-annotation-with-remove',
        {annotationToFile: true, removePropTypes: true, setFlowMode: 'weak'},
        {
            path: '/home/folder/projects/project/components/UIInput.jsx',
            annotationFilePath: '/home/folder/projects/project/components/UIInput.flow.jsx'
        }
    );
  });

  it('transforms optional PropTypes prefixed with `React`', () => {
    test('fixme-test');
  });
  it('transforms class properties', () => {
    test('class-members-annotate');
  });
  it('bugfix', () => {
    test('bug-not-set-flow-mode',  {setFlowMode: 'weak'},);
  });
});

