// ============================================
// ASSEMBLER MICROBI
// Format: OPCODE [operand]
// ============================================

const OPCODES = {
  'LDA':  0x0,  // LDA #N  → literal
  'LDA@': 0x1,  // LDA [N] → memòria
  'STA':  0x2,
  'ADD':  0x3,
  'ADD@': 0x4,
  'SUB':  0x5,
  'JMP':  0x6,
  'JZ':   0x7,
  'OUT':  0x8,
  'IN':   0x9,
  'NOP':  0xE,
  'HLT':  0xF,
};

function assemble(source) {
  const lines = source.split('\n');
  const labels = {};
  const instructions = [];
  const errors = [];
  let addr = 0;

  // ---- PRIMERA PASSADA: recollir etiquetes ----
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].split(';')[0].trim();  // treure comentaris
    if (!line) continue;

    // Etiqueta: "nom:"
    const labelMatch = line.match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
    if (labelMatch) {
      labels[labelMatch[1]] = addr;
      line = labelMatch[2].trim();
      if (!line) continue;
    }
    addr++;
  }

  // ---- SEGONA PASSADA: generar codi ----
  addr = 0;
  for (let i = 0; i < lines.length; i++) {
    let raw = lines[i];
    let line = raw.split(';')[0].trim();
    if (!line) continue;

    const labelMatch = line.match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
    if (labelMatch) line = labelMatch[2].trim();
    if (!line) continue;

    const parts = line.split(/\s+/);
    let mnemonic = parts[0].toUpperCase();
    let operand  = parts[1] || '';

    // Sintaxi: LDA #5  vs  LDA [10]
    if (mnemonic === 'LDA') {
      if (operand.startsWith('#')) { mnemonic = 'LDA'; operand = operand.slice(1); }
      else if (operand.startsWith('[')) { mnemonic = 'LDA@'; operand = operand.slice(1, -1); }
    }
    if (mnemonic === 'ADD') {
      if (operand.startsWith('#')) { mnemonic = 'ADD'; operand = operand.slice(1); }
      else if (operand.startsWith('[')) { mnemonic = 'ADD@'; operand = operand.slice(1, -1); }
    }
    if (mnemonic === 'STA' && operand.startsWith('[')) {
      operand = operand.slice(1, -1);
    }

    if (!(mnemonic in OPCODES)) {
      errors.push(`Línia ${i+1}: mnemònic desconegut "${mnemonic}"`);
      addr++;
      continue;
    }

    // Resoldre operand (número, etiqueta o buit)
    let value = 0;
    if (operand) {
      if (/^\d+$/.test(operand))       value = parseInt(operand, 10);
      else if (/^0x[0-9A-Fa-f]+$/.test(operand)) value = parseInt(operand, 16);
      else if (operand in labels)      value = labels[operand];
      else { errors.push(`Línia ${i+1}: operand desconegut "${operand}"`); }
    }

    if (value > 15) {
      errors.push(`Línia ${i+1}: operand ${value} supera 4 bits (0-15)`);
      value = value & 0x0F;
    }

    const byte = (OPCODES[mnemonic] << 4) | (value & 0x0F);
    instructions.push({ addr, byte, source: raw.trim(), mnemonic, operand: value });
    addr++;
  }

  return { instructions, labels, errors };
}