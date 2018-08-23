const vorpal = require('vorpal')();
const MachineActions = require('./machineActions.js');
const fs = require('fs');
const chalk = require('chalk');
const intro = require('./intro.js');

const machineActions = new MachineActions(vorpal);

const validateFileExists = (args) => {
  let file = args.file;
  if(!fs.existsSync(file)) 
    return chalk.red(`Unable to find ${file}`);
  return true; 
}

vorpal
  .command('load <file>','loads a program')
  .alias('l')
  .allowUnknownOptions()
  .validate(validateFileExists)
  .action(machineActions.loadProgram.bind(machineActions));

vorpal
  .command('run','runs a program that is loaded')
  .alias('r')
  .allowUnknownOptions()
  .action(machineActions.run.bind(machineActions));

vorpal
  .command('step','steps into a program that is loaded')
  .alias('s')
  .allowUnknownOptions()
  .action(machineActions.step.bind(machineActions));

vorpal
  .command('next','steps into a program that is loaded')
  .alias('n')
  .allowUnknownOptions()
  .action(machineActions.next.bind(machineActions));

vorpal
  .command('show table','shows the machine\'s trace table')
  .alias('st')
  .option('-f, --from <line>','the line number from which to print the table')
  .option('-t, --to <line>','the line upto which to print the table')
  .action(machineActions.showTable.bind(machineActions));

vorpal
  .command('show output','shows the machine\'s print output')
  .alias('so')
  .action(machineActions.showOutput.bind(machineActions));

vorpal
  .command('show stack','shows the machine\'s stack')
  .alias('ss')
  .allowUnknownOptions()
  .action(machineActions.showStack.bind(machineActions))

vorpal
  .command('show program','shows the program loaded into the machine')
  .alias('sp')
  .allowUnknownOptions()
  .action(machineActions.showProgram.bind(machineActions));


vorpal.log(intro);
vorpal.delimiter('>>').show();