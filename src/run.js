const Machine = require('assembly_simulator');
const fs = require('fs');
const Table = require('cli-table');

const printPrn = prn => prn.forEach(output=>console.log(output));

const createTable = () => new Table({
  chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''},
  head:['CL','NL','A','B','C','D','EQ','NE','GT','LT','PRN'],
  colWidths: [5,5,5,5,5,5,5,5,5,5,5]
})

const mapRow = ({CL,NL,A,B,C,D,EQ,NE,GT,LT,PRN}) => {
  let prn = PRN?PRN:"";
  return [CL,NL,A,B,C,D,EQ,NE,GT,LT,prn];
};

const printTable = machineTable => {
  let table=createTable();
  machineTable.forEach(row => table.push(mapRow(row)));
  console.log(table.toString());
};


const program = fs.readFileSync(process.argv[2],"utf8");
let m=new Machine();
try {
  m.load(program);
  m.execute();
  printTable(m.getTable());
  printPrn(m.getPrn());
} catch (e) {
  console.log(e);
}
