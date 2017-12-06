import { contains } from 'underscore';

export const VARIABLE_TYPES = ['int', 'float'];


export const findNextCloseBracketIndex = (token) => {
  let openBracketCount = 0;
  let closeBracketCount = 0;
  let closeBracketIndex = null;
  token.forEach((t, idx) => {
    if (t.lexeme === '{') {
      openBracketCount++;
    } else if (t.lexeme === '}') {
      closeBracketCount++;
    }
    if (closeBracketIndex === null && openBracketCount === closeBracketCount && openBracketCount !== 0) {
      closeBracketIndex = idx;
    }
  });
  if (openBracketCount !== closeBracketCount) {
    return null;
  }
  return closeBracketIndex;
}

export const findNextCloseParenthesesIndex = (token, fromIndex = 0) => {
  let openCount = 0;
  let closeCount = 0;
  let closeIndex = null;
  token.forEach((t, idx) => {
    if (idx >= fromIndex) {
      if (t.lexeme === '(') {
        openCount++;
      } else if (t.lexeme === ')') {
        closeCount++;
      }
      if (closeIndex === null && openCount === closeCount && openCount !== 0) {
        closeIndex = idx;
      }
    }
  });
  if (openCount !== closeCount) {
    return null;
  }
  return closeIndex;
}

export const isExpressionStart = (tokenItem) => {
  let lexemes = ['while'];
  lexemes = lexemes.concat(VARIABLE_TYPES);
  return contains(lexemes, tokenItem.lexeme);
}

export const createError = (message, row = null) => ({ message, row });
