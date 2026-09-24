// ============================================
// RENDERITZAT DE LA UI
// ============================================

function toBin8(n) { return (n & 0xFF).toString(2).padStart(8, '0'); }
function toHex(n)  { return '0x' + (n & 0xFF).toString(16).toUpperCase().padStart(2, '0'); }

function renderCPU(cpu) {
  document.getElementById('reg-pc').textContent  = toBin8(cpu.PC);
  document.getElementById('reg-ir').textContent  = toBin8(cpu.IR);
  document.getElementById('reg-ac').textContent  = toBin8(cpu.AC);
  document.getElementById('reg-mar').textContent = toBin8(cpu.MAR);
  document.getElementById('reg-mdr').textContent = toBin8(cpu.MDR);
  document.getElementById('reg-z').textContent   = cpu.Z;
  document.getElementById('cpu-cycle').textContent = 'Cicle: ' + cpu.cycle;
  document.getElementById('cpu-state').textContent =
    cpu.halted ? '⏹️ Aturat (HLT)' : '▶️ En marxa';
}

function renderMemory(mem, highlightAddr = -1) {
  const grid = document.getElementById('memory-grid');
  grid.innerHTML = '';
  for (let i = 0; i < 64; i++) {  // mostrem només 64 per claredat
    const cell = document.createElement('div');
    cell.className = 'mem-cell';
    if (i === highlightAddr) cell.classList.add('active');
    if (mem.read(i) !== 0) cell.classList.add('non-zero');
    cell.innerHTML = `<span class="addr">${i.toString(16).padStart(2,'0')}</span>
                      <span class="val">${mem.read(i).toString(16).padStart(2,'0').toUpperCase()}</span>`;
    grid.appendChild(cell);
  }
}

function renderMachineCode(instructions) {
  const el = document.getElementById('machine-code');
  el.innerHTML = instructions.map(i =>
    `<div class="mc-line">
       <span class="mc-addr">${i.addr.toString(16).padStart(2,'0')}:</span>
       <span class="mc-byte">${i.byte.toString(16).padStart(2,'0').toUpperCase()}</span>
       <span class="mc-src">${i.source}</span>
     </div>`
  ).join('');
}

function renderLEDs(outputs) {
  const el = document.getElementById('leds');
  el.innerHTML = outputs.map((v, i) =>
    `<div class="led ${v ? 'on' : ''}" title="Port ${i}: ${v}">
       <span class="led-val">${v.toString(16).toUpperCase()}</span>
     </div>`
  ).join('');
}

function log(msg, type = 'info') {
  const el = document.getElementById('log');
  const line = document.createElement('div');
  line.className = 'log-line ' + type;
  line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  el.prepend(line);
}