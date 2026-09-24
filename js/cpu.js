// ============================================
// MICROBI CPU — Von Neumann
// ============================================

class MicrobiCPU {
  constructor(memory) {
    this.mem = memory;
    this.reset();
  }

  reset() {
    this.PC  = 0;   // Program Counter
    this.IR  = 0;   // Instruction Register
    this.AC  = 0;   // Accumulator
    this.MAR = 0;   // Memory Address Register
    this.MDR = 0;   // Memory Data Register
    this.Z   = 0;   // Zero flag
    this.halted = false;
    this.cycle = 'FETCH';
    this.outputs = new Array(8).fill(0);
  }

  // -------- CICLE D'INSTRUCCIÓ --------
  step() {
    if (this.halted) return { done: true };

    switch (this.cycle) {
      case 'FETCH':   this._fetch();   break;
      case 'DECODE':  this._decode();  break;
      case 'EXECUTE': this._execute(); break;
      case 'WRITEBACK': this._writeback(); break;
    }
    return { done: this.halted };
  }

  _fetch() {
    this.MAR = this.PC;
    this.MDR = this.mem.read(this.MAR);
    this.IR  = this.MDR;
    this.PC  = (this.PC + 1) & 0xFF;
    this.cycle = 'DECODE';
  }

  _decode() {
    this.opcode = (this.IR >> 4) & 0x0F;
    this.operand = this.IR & 0x0F;
    this.cycle = 'EXECUTE';
  }

  _execute() {
    switch (this.opcode) {
      case 0x0: // LDA #N
        this.AC = this.operand;
        break;

      case 0x1: // LDA [N]
        this.MAR = this.operand;
        this.AC  = this.mem.read(this.MAR);
        break;

      case 0x2: // STA [N]
        this.MAR = this.operand;
        this.MDR = this.AC;
        this.mem.write(this.MAR, this.MDR);
        break;

      case 0x3: // ADD #N
        this.AC = (this.AC + this.operand) & 0xFF;
        break;

      case 0x4: // ADD [N]
        this.MAR = this.operand;
        this.AC  = (this.AC + this.mem.read(this.MAR)) & 0xFF;
        break;

      case 0x5: // SUB #N
        this.AC = (this.AC - this.operand) & 0xFF;
        break;

      case 0x6: // JMP N
        this.PC = this.operand;
        break;

      case 0x7: // JZ N
        if (this.AC === 0) this.PC = this.operand;
        break;

      case 0x8: // OUT N
        if (this.operand < 8) {
          this.outputs[this.operand] = this.AC & 0xFF;
        }
        break;

      case 0x9: // IN N  (per ara, llegim 0)
        this.AC = 0;
        break;

      case 0xE: // NOP
        break;

      case 0xF: // HLT
        this.halted = true;
        break;

      default:
        console.warn(`Opcode desconegut: 0x${this.opcode.toString(16)}`);
    }
    this.Z = (this.AC === 0) ? 1 : 0;
    this.cycle = 'WRITEBACK';
  }

  _writeback() {
    this.cycle = 'FETCH';
  }
}