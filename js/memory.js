class MicrobiMemory {
  constructor(size = 256) {
    this.size = size;
    this.data = new Uint8Array(size);
  }

  read(addr) {
    return this.data[addr & 0xFF] || 0;
  }

  write(addr, value) {
    this.data[addr & 0xFF] = value & 0xFF;
  }

  clear() {
    this.data.fill(0);
  }

  load(program, start = 0) {
    for (let i = 0; i < program.length; i++) {
      this.write(start + i, program[i]);
    }
  }
}