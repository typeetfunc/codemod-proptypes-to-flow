import {
    uniqBy
} from 'ramda'

function classDeclarationFromProp(path) {
    return path.parentPath.parentPath.parentPath;
}

function findStaticByName(j, node, name) {
    return node.find(j.ClassProperty, {
        key: {
            type: 'Identifier',
            name,
        }
    });
}

function findDynamicByName(j, node, name) {
    return node.find(j.AssignmentExpression, {
        left: {
            property: {
                name,
            },
        }
    });
}

function findAnyByName(j, node, name) {
    const id = {
        id: {
            name
        }
    };
    const any = [j.ClassDeclaration, j.FunctionDeclaration, j.VariableDeclarator]
        .reduce((acc, type) => {
            if (acc) {
                return acc;
            } else {
                const collect = node.find(type, id);
                return collect.size() ? collect.paths()[0] : null;
            }
        }, null);
    if (any && j.VariableDeclarator.check(any.node) && !j.ArrowFunctionExpression.check(any.node.init)) {
        return;
    }
    return any;
}


function findStaticAndDynamicWithComp(j, root, name) {
    const staticNodes = findStaticByName(j, root, name);
    const dynamicNodes = findDynamicByName(j, root, name);
    const nodes = staticNodes
        .paths()
        .map(path => ({
            component: classDeclarationFromProp(path),
            [name]: path.value.value
        }))
        .concat(
            dynamicNodes
            .paths()
            .map(path => ({
                component: findAnyByName(j, root, path.node.left.object.name),
                [name]: path.parentPath.value.expression.right
            }))
        ).filter(({
            component
        }) => component);
    return nodes;
}

function isEqualComp(comp1, comp2) {
    return comp1.node.id.name === comp2.node.id.name;
}

function mergeByComponent(list1, list2) {
    return list1
        .map(({
            component: comp,
            ...rest
        }) => {
            const finded = list2.find(({
                component
            }) => isEqualComp(component, comp));
            return finded ? {...finded,
                ...rest
            } : {
                component: comp,
                ...rest
            };
        })
}

const uniqByComponent = uniqBy(({
    component
}) => component)

export default function findTypesAndDefaults(j, root) {
    const propTypes = uniqByComponent(findStaticAndDynamicWithComp(j, root, 'propTypes'))
    const defaultProps = uniqByComponent(findStaticAndDynamicWithComp(j, root, 'defaultProps'))
    return mergeByComponent(propTypes, defaultProps);
}


export {
    classDeclarationFromProp,
    findAnyByName,
    findStaticAndDynamicWithComp,
    isEqualComp,
    mergeByComponent,
    findStaticByName,
    findDynamicByName
};