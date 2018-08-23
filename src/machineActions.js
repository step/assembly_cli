const Machine = require('@craftybones/assembly_simulator');
const fs = require('fs');
const Table = require('cli-table');
const chalk = require('chalk');

const mapRow = ({ CL, NL, INST, A, B, C, D, EQ, NE, GT, LT, PRN, STK }) => {
  let prn = PRN ? PRN : ''; // cli-table doesn't handle undefined.
  let stk = STK.slice(-3).join(", ");
  return [CL, NL, INST, A, B, C, D, EQ, NE, GT, LT, prn, stk];
};

const createTable = () =>
  new Table({
    chars: { mid: '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
    head: ['CL', 'NL', 'INST', 'A', 'B', 'C', 'D', 'EQ', 'NE', 'GT', 'LT', 'PRN', 'STK'],
    colWidths: [5, 5, 14, 5, 5, 5, 5, 5, 5, 5, 5, 5, 15]
});

class MachineActions {
  constructor(vorpal) {
    this.machine = new Machine();
    this.program = '';
    this.vorpal = vorpal;9
  }

  loadProgram(args,callback) {
    let file=args.file;
    let prog;
    try {
      prog = fs.readFileSync(file,'utf8');
    } catch (error) {
      this.vorpal.log(chalk.red(`Unable to read ${file}\n`));
      callback();
      return;
    }
    try {
      this.program = prog;
      this.machine.load(prog);
    } catch (error) {
      let message = `Problems loading ${file}`
      if(error.name == `InvalidInstructionException`) {
        message = `Error on line number ${error.lineNumber}\n${error.instruction}`;
      }
      this.vorpal.log(chalk.red(message));
      callback();
      return;
    }
    this.vorpal.log(`Loaded ${file}...Ok`);
    callback();
  }

  showProgram(args,callback) {
    this.vorpal.log(this.program);
    callback();
  }

  run(args, callback) {
    this.machine.execute();
    this.vorpal.log(`Ok`);
    callback();
  }

  showOutput(args,callback) {
    let prn = this.machine.getPrn();
    let table = new Table({
      head: ['# ', 'Output'],
      colWidths: [5, 80]
    });
    prn.forEach((r,i)=>table.push([i+1,r]));
    this.vorpal.log(table.toString());
    callback();
  }

  step(args, callback) {
    this.machine.executeStepWise((state) => {
      this._printTable([state]);
    });
    this.vorpal.log(`Ok`);
    callback();
  }

  next(args,callback) {
    this.machine.nextStep();
    callback();
  }

  _printTable(traceTable) {
    let cliTable = createTable();
    traceTable.forEach(row => cliTable.push(mapRow(row)));
    this.vorpal.log(cliTable.toString());
  }
  
  showTable(args,callback) {
    let fromLine = args.options.from || 0;
    let sliceOptions = [fromLine];
    if(args.options.to) sliceOptions.push(args.options.to);
    let table = this.machine.getTable();
    let slicedTable = Array.prototype.slice.apply(table,sliceOptions);
    this._printTable(slicedTable);
    callback();
  }

  showStack(args,callback) {
    let stack = this.machine.getStack();
    let table = new Table({head:['# ', 'STACK']});
    stack.reverse().forEach((r,i)=>table.push([i+1,r]));
    this.vorpal.log(table.toString());
    callback();
  }
}

module.exports = MachineActions;