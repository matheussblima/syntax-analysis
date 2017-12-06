import { assertFalse, assertTrue } from '.';

describe("main", function () {
  it('Código sem função principal deve FALHAR', () => {
    const code = `
      int n = 10;
    `;
    assertFalse(code);
  });
  it('Código com função principal deve PASSAR', () => {
    const code = `
      int main() {
        int n = 10;
      }
    `;
    assertTrue(code);
  });
  it('Código com função principal fora de sintaxe deve FALHAR', () => {
    const code = `
      int main) {
        
      }
    `;
    assertFalse(code);
  });
  it('Código com função principal sem chaves deve FALHAR', () => {
    const code = `
      int main()

      }
    `;
    assertFalse(code);
  });
});

describe("while", function () {
  it('while fora de sintaxe deve FALHAR', () => {
    const code = `
      int main() {
        while( {

        }
      }
    `;
    assertFalse(code);
  });
  it('while com sintaxe correta deve PASSAR', () => {
    const code = `
      int main() {
        while() {
        }
      }
    `;
    assertTrue(code);
  });
  it('while com sintaxe correta com os filhos com sintaxe errada deve FALHAR (1)', () => {
    const code = `
      int main() {
        while() {
          int x
        }
      }
    `;
    assertFalse(code);
  });
  it('while com sintaxe correta com os filhos com sintaxe errada deve FALHAR (2)', () => {
    const code = `
      int main() {
        while() {
          int x;
          while( {
          }
        }
      }
    `;
    assertFalse(code);
  });
  it('while com sintaxe correta com os filhos com sintaxe correta deve PASSAR', () => {
    const code = `
      int main() {
        while(x && z) {
          int x;
          while() {
            int n = 100;
          }
        }
      }
    `;
    assertTrue(code);
  });
});

describe("expression-parser", function () {
  it('Expressão com sintaxe correta deve PASSAR', () => {
    const code = `
      int main() {
        x = 10 + (200) - 100 + (200 * 30) - (60 - (x * 30 - 48 * 2 - (100 / x)));
      }
    `;
    assertTrue(code);
  });
  it('Expressão com sintaxe errada deve FALHAR (1)', () => {
    const code = `
      int main() {
        x = 10 + ((200);
      }
    `;
    assertFalse(code);
  });
  it('Expressão com sintaxe errada deve FALHAR (2)', () => {
    const code = `
      int main() {
        x = 10 (200);
      }
    `;
    assertFalse(code);
  });
  it('Expressão com sintaxe errada deve FALHAR (3)', () => {
    const code = `
      int main() {
        x = 10 + 4
      }
    `;
    assertFalse(code);
  });
});

describe("var-declaration-parser", function () {
  it('Declaração de variável com sintaxe correta deve PASSAR', () => {
    const code = `
      int main() {
        int x;
        int y = 10;
        float n;
      }
    `;
    assertTrue(code);
  });
  it('Declaração de variável com sintaxe errada deve FALHAR', () => {
    const code = `
      int main() {
        int = 99;
      }
    `;
    assertFalse(code);
  });
  it('Declaração de variável com sintaxe errada deve FALHAR', () => {
    const code = `
      int main() {
        int z =;
      }
    `;
    assertFalse(code);
  });
  it('Declaração de variável com sintaxe errada deve FALHAR', () => {
    const code = `
      int main() {
        int z = a;
      }
    `;
    assertTrue(code);
  });
});
