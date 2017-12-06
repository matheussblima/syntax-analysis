import { expect } from 'chai';
import lexer from 'node-c-lexer';
import mainParser from '../src/parsers/main-parser';


export const assertStatus = (code, status) => {
  const token = lexer.lexUnit.tokenize(code);
  const errors = [];
  const parserStatus = mainParser(token, errors);
  expect(parserStatus).to.equal(status);
}


export const assertTrue = (code, status) => assertStatus(code, true);
export const assertFalse = (code, status) => assertStatus(code, false);

