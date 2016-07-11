jest.autoMockOff();

const fs = require('fs');
const p = require('path');

const read = fileName => fs.readFileSync(
    p.join(__dirname, '..', 'test', fileName),
    'utf8'
);

global.test = (testFolderName, options, fakeOptions = {}) => {
    const jscodeshift = require('jscodeshift');
    const sourcePath = p.join(testFolderName, 'input.js')
    const source = read(sourcePath);
    const output = read(p.join(testFolderName, 'output.js')).trim();

    let path = fakeOptions.path || sourcePath;
    let transform = require(
        p.join(global.baseDir, 'index')
    );
    if (transform.default) {
        transform = transform.default;
    }

    let result = transform({
        path,
        source
    }, {
        jscodeshift
    }, options || {}) || ''
    if (Array.isArray(result)) {
        const [mainFile, annotationFile] = result
        const flowFile = read(p.join(testFolderName, 'output.flow.js')).trim()
        expect(mainFile.trim()).toEqual(output)
        expect(annotationFile.source).toEqual(flowFile)
            //console.log(result)
        fakeOptions.annotationFilePath && expect(annotationFile.path).toEqual(fakeOptions.annotationFilePath)
    } else {
        expect(result.trim()).toEqual(output)
            //console.log(result)
    }
};