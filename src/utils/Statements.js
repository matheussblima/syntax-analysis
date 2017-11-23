import { isIdentifier } from './Validations';

export default () => {};

// declaration-statement: local-variable-declaration ;
const DeclarationStatement = () => {};

// local-variable-declaration: type variable-declarator {, variable-declarator}
const LocalVariableDeclaration = () => {};

// variable-declarator: identifier | identifier = variable-initializer
const VariableDeclarator = () => isIdentifier();
