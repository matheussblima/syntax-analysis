import { isIdentifier } from './Validations';
import { primitiveTypes } from './Type';

import { getToken } from './Token';

export default () => {};

// variable-declarator: identifier | identifier = variable-initializer
const VariableDeclarator = value => isIdentifier(value);

// local-variable-declaration: type variable-declarator {, variable-declarator}
const LocalVariableDeclaration = (value) => {
  if (primitiveTypes(value)) {
    const newToken = getToken();
    return VariableDeclarator(newToken);
  }
  return false;
};

// declaration-statement: local-variable-declaration ;
const DeclarationStatement = (value) => {
  if (LocalVariableDeclaration(value)) {
    const newToken = getToken();
    if (newToken === ';') {
      // Tudo certo
    }
  }
};
