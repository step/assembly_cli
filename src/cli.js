const vorpal = require('vorpal')();
const Machine = require('@craftybones/assembly_simulator');
const fs = require('fs');
const Table = require('cli-table');
const chalk = require('chalk');
const intro = require('./intro.js');

const m = new Machine();
let program = "";

const printExecutionTable = (state) => {
  let table = [state];
  printTable(table);
}

const createTable = () =>
new Table({
    chars: { mid: '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
    head: ['CL', 'NL', 'INST', 'A', 'B', 'C', 'D', 'EQ', 'NE', 'GT', 'LT', 'PRN', 'STK'],
    colWidths: [5, 5, 14, 5, 5, 5, 5, 5, 5, 5, 5, 5, 15]
  });

const createPrnTable = () =>
  new Table({
    head: ['# ', 'Output'],
    colWidths: [5, 80]
  });

const mapRow = ({ CL, NL, INST, A, B, C, D, EQ, NE, GT, LT, PRN, STK }) => {
  let prn = PRN ? PRN : ''; // cli-table doesn't handle undefined.
  let stk = STK.slice(-3).join(", ");
  return [CL, NL, INST, A, B, C, D, EQ, NE, GT, LT, prn, stk];
};

const printTable = machineTable => {
  let table = createTable();
  machineTable.forEach(row => table.push(mapRow(row)));
  vorpal.log(table.toString());
};

const printOutput = prn => {
  let table = createPrnTable();
  prn.forEach((r,i)=>table.push([i+1,r]));
  vorpal.log(table.toString());
};

const printStack = stack => {
  let table = new Table({head:['# ', 'STACK']});
  stack.reverse().forEach((r,i)=>table.push([i+1,r]));
  vorpal.log(table.toString());
}

const validateFileExists = (args) => {
  let file = args.file;
  if(!fs.existsSync(file)) 
    return chalk.red(`Unable to find ${file}`);
  return true; 
}

vorpal
  .command('load <file>','loads a program')
  .allowUnknownOptions()
  .validate(validateFileExists)
  .action(function(args,callback){
    let prog='';
    let file=args.file;
    try {
      prog = fs.readFileSync(file,'utf8');
    } catch (error) {
      this.log(chalk.red(`Unable to read ${file}\n`));
      callback();
      return;
    }
    try {
      program = prog;
      m.load(prog);
    } catch (error) {
      let message = `Problems loading ${file}`
      if(error.name == `InvalidInstructionException`) {
        message = `Error on line number ${error.lineNumber}\n${error.instruction}`;
      }
      this.log(chalk.red(message));
      callback();
      return;
    }
    this.log(`Loaded ${file}...Ok`);
    callback();
  });

vorpal
  .command('run','runs a program that is loaded')
  .allowUnknownOptions()
  .action(function(args,callback){
    m.execute();
    this.log(`Ok`);
    callback();
  });

vorpal
  .command('step','steps into a program that is loaded')
  .allowUnknownOptions()
  .action(function(args,callback){
    m.executeStepWise(printExecutionTable);
    this.log(`Ok`);
    callback();
  });

vorpal
  .command('next','steps into a program that is loaded')
  .allowUnknownOptions()
  .action(function(args,callback){
    m.nextStep();
    this.log(`Ok`);
    callback();
  });

  vorpal
  .command('show table','shows the machine\'s trace table')
  .action(function(args,callback){
    let table = m.getTable();
    printTable(table);
    callback();
  });

  vorpal
  .command('show print','shows the machine\'s print output')
  .action(function(args,callback){
    let prn = m.getPrn();
    printOutput(prn);
    callback();
  });

vorpal
  .command('show stack','shows the machine\'s stack')
  .allowUnknownOptions()
  .action(function(args,callback){
    let stack = m.getStack();
    printStack(stack);
    callback();
  });

vorpal
  .command('show program','shows the program loaded into the machine')
  .allowUnknownOptions()
  .action(function(args,callback){
    vorpal.log(program);
    callback();
  });


vorpal.log(intro);
vorpal.delimiter('>>').show();