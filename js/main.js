// ============================================
// INICIALITZACIÓ I CONTROLS
// ============================================

const mem = new MicrobiMemory(256);
const cpu = new MicrobiCPU(mem);
let runInterval = null;
let lastInstructions = [];

function refresh() {
  renderCPU(cpu);
  renderMemory(mem, cpu.MAR);
  renderLEDs(cpu.outputs);
}

function doStep() {
  if (cpu.halted) { log('CPU aturada', 'warn'); return; }
  const prevCycle = cpu.cycle;
  cpu.step();
  log(`Cicle ${prevCycle} → PC=${cpu.PC} IR=${toHex(cpu.IR)} AC=${toHex(cpu.AC)}`);
  refresh();

  // Si estem a punt de fer FETCH i ja hem acabat instrucció, log
  if (cpu.cycle === 'FETCH' && cpu.IR !== 0) {
    const instr = lastInstructions.find(i => i.addr === ((cpu.PC - 1) & 0xFF));
    if (instr) log(`  ↳ Executat: ${instr.source}`, 'exec');
  }
}

function doRun() {
  if (runInterval) return;
  const hz = parseInt(document.getElementById('speed').value);
  log(`▶️ Executant a ${hz} Hz`, 'info');
  runInterval = setInterval(() => {
    if (cpu.halted) { doPause(); return; }
    doStep();
  }, Math.max(50, 1000 / hz));
}

function doPause() {
  if (runInterval) { clearInterval(runInterval); runInterval = null; }
  log('⏸️ Pausat', 'info');
}

function doReset() {
  doPause();
  cpu.reset();
  log('⟲ Reiniciat', 'info');
  refresh();
}

function doAssemble() {
  const src = document.getElementById('asm-input').value;
  const result = assemble(src);

  if (result.errors.length) {
    result.errors.forEach(e => log('❌ ' + e, 'error'));
    return;
  }

  mem.clear();
  cpu.reset();
  lastInstructions = result.instructions;
  mem.load(result.instructions.map(i => i.byte));

  renderMachineCode(result.instructions);
  log(`✅ Assemblat: ${result.instructions.length} instruccions`, 'ok');
  refresh();
}

// ---------- EVENTS ----------
document.getElementById('btn-step').onclick  = doStep;
document.getElementById('btn-run').onclick   = doRun;
document.getElementById('btn-pause').onclick = doPause;
document.getElementById('btn-reset').onclick = doReset;
document.getElementById('btn-assemble').onclick = doAssemble;

document.getElementById('btn-clear').onclick = () => {
  document.getElementById('asm-input').value = '';
};

document.getElementById('speed').oninput = (e) => {
  document.getElementById('speed-label').textContent = e.target.value + ' Hz';
  if (runInterval) { doPause(); doRun(); }
};
document.getElementById('example-select').onchange = (e) => {
  const examples = {
    suma: `; Suma 5 + 3\nLDA #5\nADD #3\nOUT 0\nHLT`,
    comptador: `; Comptador 0-9\nLDA #0\nbucle:\nOUT 0\nADD #1\nJMP bucle`,
    semafor: `; Semàfor simple\ninici:\nLDA #1\nOUT 0\nLDA #2\nOUT 0\nJMP inici`,
    multiplica: `; Multiplica 3·4\nLDA #0\nSTA [10]\nLDA #4\nSTA [11]\nbucle:\nLDA [10]\nADD #3\nSTA [10]\nLDA [11]
    \nSUB #1\nSTA [11]\nJZ fi\nJMP bucle\nfi:\nLDA [10]\nOUT 0\nHLT`
    
  };
  if (examples[e.target.value]) {
    document.getElementById('asm-input').value = examples[e.target.value];
  }
};

// Inicialització
refresh();
log('🧫 Microbi a punt. Escriu un programa i prem "Assemblar".', 'ok');
