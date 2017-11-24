var command;
var newCommand = true;

export const setToken = (value) => {
  // Buscando a primeira ocorrência de ; para identificar o fim do comando.
  const positionOccurrence = value.search(';');
  if (positionOccurrence !== -1 && newCommand) {
    command = value.substr(0, positionOccurrence);
    command = command.split(' ');
    command.push(';');
    command = command.reverse();
    newCommand = false;
  }
};

export const getToken = () => {
  if (!newCommand) {
    return command.pop();
  }
};
