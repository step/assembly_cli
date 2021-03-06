const Machine = require('assembly_simulator');
const fs = require('fs');
const Table = require('cli-table');

const createTable = () =>
  new Table({
    chars: { mid: '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
    head: ['CL', 'NL', 'INST', 'A', 'B', 'C', 'D', 'EQ', 'NE', 'GT', 'LT', 'PRN'],
    colWidths: [5, 5, 14, 5, 5, 5, 5, 5, 5, 5, 5, 5]
  });

const createPrnTable = () =>
  new Table({
    head: ['Output'],
    colWidths: [80]
  });

const mapRow = ({ CL, NL, INST, A, B, C, D, EQ, NE, GT, LT, PRN }) => {
  let prn = PRN ? PRN : ''; // cli-table doesn't handle undefined.
  return [CL, NL, INST, A, B, C, D, EQ, NE, GT, LT, prn];
};

const printTable = machineTable => {
  let table = createTable();
  machineTable.forEach(row => table.push(mapRow(row)));
  console.log(table.toString());
};

const printOutput = prn => {
  let table = createPrnTable();
  table.push([prn.join('\n')]);
  console.log(table.toString());
};

try {
  const program = fs.readFileSync(process.argv[2], 'utf8');
  let m = new Machine();
  m.load(program);
  m.execute();
  printTable(m.getTable());
  printOutput(m.getPrn());
} catch (e) {
  if(e.name == 'InvalidInstructionException') {
    console.log(`You seem to have an error in ${process.argv[2]} on line number: ${e.lineNumber}`);
    console.log(e.instruction);
  } else {
    console.log(e);
    console.log('Something went wrong');
  }
}
