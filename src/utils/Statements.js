import { isIdentifier } from './Validations';
import { primitiveTypes } from './Type';

export default () => {};

// declaration-statement: local-variable-declaration ;
const DeclarationStatement = (value) => {
  if (LocalVariableDeclaration(value)) {
    const newToken = getNewToken();
    if (newToken === ';') {
      // Tudo certo
    }
  }
};

// local-variable-declaration: type variable-declarator {, variable-declarator}
const LocalVariableDeclaration = (value) => {
  if (primitiveTypes(value)) {
    const newToken = getNewToken();
    return VariableDeclarator(newToken);
  }
  return false;
};

// variable-declarator: identifier | identifier = variable-initializer
const VariableDeclarator = value => isIdentifier(value);
