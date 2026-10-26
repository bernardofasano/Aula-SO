
const express = require("express");
const os = require("os");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

let previousCPUs = os.cpus();
const startTime = Date.now();

function bytesGB(value) {
  return (value / 1024 / 1024 / 1024).toFixed(2);
}

function bytesMB(value) {
  return (value / 1024 / 1024).toFixed(2);
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${days}d ${hours}h ${minutes}m`;
}

function getCPUUsage() {
  const currentCPUs = os.cpus();

  const cores = currentCPUs.map((cpu, index) => {
    const current = cpu.times;
    const previous = previousCPUs[index].times;

    const currentTotal = Object.values(current)
      .reduce((sum, value) => sum + value, 0);

    const previousTotal = Object.values(previous)
      .reduce((sum, value) => sum + value, 0);

    const totalDifference = currentTotal - previousTotal;
    const idleDifference = current.idle - previous.idle;

    let usage = 0;

    if (totalDifference > 0) {
      usage = Math.round(
        ((totalDifference - idleDifference) / totalDifference) * 100
      );
    }

    return {
      core: index + 1,
      model: cpu.model,
      speed: cpu.speed,
      usage: Math.max(0, Math.min(100, usage))
    };
  });

  previousCPUs = currentCPUs;

  const average = cores.length
    ? Math.round(
        cores.reduce((sum, cpu) => sum + cpu.usage, 0) /
        cores.length
      )
    : 0;

  return { average, cores };
}

function getIPs() {
  const interfaces = os.networkInterfaces();
  const result = [];

  for (const name in interfaces) {
    for (const net of interfaces[name] || []) {
      result.push({
        interface: name,
        address: net.address,
        family: net.family,
        internal: net.internal,
        mac: net.mac
      });
    }
  }

  return result;
}

function getFiles() {
  try {
    return fs.readdirSync(process.cwd(), {
      withFileTypes: true
    }).slice(0, 30).map(file => {
      const fullPath = path.join(process.cwd(), file.name);
      const stat = fs.statSync(fullPath);

      return {
        name: file.name,
        type: file.isDirectory() ? "Diretório" : "Arquivo",
        size: file.isDirectory()
          ? "-"
          : bytesMB(stat.size) + " MB",
        modified: stat.mtime.toLocaleString("pt-BR")
      };
    });
  } catch {
    return [];
  }
}

function getHealth(ram, cpu, load, cores) {
  if (ram >= 90 || cpu >= 90 || load > cores * 1.5) {
    return { label: "CRÍTICO", color: "#ef4444" };
  }

  if (ram >= 75 || cpu >= 75 || load > cores) {
    return { label: "ATENÇÃO", color: "#f59e0b" };
  }

  return { label: "NORMAL", color: "#22c55e" };
}

function getStatus() {
  const totalRAM = os.totalmem();
  const freeRAM = os.freemem();
  const usedRAM = totalRAM - freeRAM;

  const ramPercent = totalRAM
    ? Math.round((usedRAM / totalRAM) * 100)
    : 0;

  const cpu = getCPUUsage();
  const load = os.loadavg();
  const ips = getIPs();

  const mainIP = ips.find(
    ip => !ip.internal && ip.family === "IPv4"
  );

  const health = getHealth(
    ramPercent,
    cpu.average,
    load[0],
    cpu.cores.length
  );

  return {
    updatedAt: new Date().toLocaleString("pt-BR"),

    system: {
      hostname: os.hostname(),
      type: os.type(),
      release: os.release(),
      platform: os.platform(),
      architecture: os.arch(),
      node: process.version,
      uptime: formatUptime(os.uptime()),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },

    memory: {
      total: bytesGB(totalRAM),
      used: bytesGB(usedRAM),
      free: bytesGB(freeRAM),
      percent: ramPercent
    },

    cpu: {
      average: cpu.average,
      count: cpu.cores.length,
      model: cpu.cores[0]?.model || "N/A",
      cores: cpu.cores,
      load: load.map(value => value.toFixed(2))
    },

    network: {
      mainIP: mainIP ? mainIP.address : "N/A",
      interfaces: ips
    },

    files: getFiles(),

    process: {
      pid: process.pid,
      directory: process.cwd(),
      memory: bytesMB(process.memoryUsage().rss),
      execPath: process.execPath,
      uptime: formatUptime(
        Math.floor((Date.now() - startTime) / 1000)
      )
    },

    environment: {
      cloud: process.env.RENDER
        ? "Render"
        : "Local ou outro ambiente",
      port: PORT,
      nodeEnv: process.env.NODE_ENV || "development"
    },

    health
  };
}

// API de monitoramento
app.get("/api/status", (req, res) => {
  res.set("Cache-Control", "no-store");
  res.json(getStatus());
});

// Página principal
app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#0b1120">
<title>SO Dashboard 4.0</title>

<style>
:root {
  --bg: #0b1120;
  --panel: #151e30;
  --border: #27344a;
  --text: #e5edf8;
  --muted: #91a1b9;
  --blue: #3b82f6;
  --green: #22c55e;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 24px;
  background: var(--bg);
  color: var(--text);
  font-family: Arial, sans-serif;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 25px;
}

h1 {
  margin: 0 0 8px;
  font-size: 28px;
}

h2 {
  font-size: 18px;
  margin-top: 0;
}

p {
  overflow-wrap: anywhere;
}

.muted, .subtitle {
  color: var(--muted);
  font-size: 13px;
}

.status {
  display: inline-block;
  padding: 9px 13px;
  border-radius: 20px;
  background: #183325;
  color: var(--green);
  font-weight: bold;
  font-size: 12px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}

.card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px;
  min-width: 0;
}

.kpi-label {
  color: var(--muted);
  font-size: 13px;
}

.kpi-value {
  font-size: 27px;
  font-weight: bold;
  margin-top: 10px;
}

.bar {
  width: 100%;
  height: 9px;
  background: #29364b;
  border-radius: 10px;
  margin: 12px 0;
  overflow: hidden;
}

.fill {
  height: 100%;
  width: 0;
  background: var(--blue);
  border-radius: 10px;
  transition: width .4s;
}

.green { background: var(--green); }
.orange { background: #f59e0b; }
.red { background: #ef4444; }

.info {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  padding: 9px 0;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
}

.info span:first-child {
  color: var(--muted);
}

.info span:last-child {
  text-align: right;
  overflow-wrap: anywhere;
}

.core {
  margin: 15px 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

th, td {
  text-align: left;
  padding: 10px 7px;
  border-bottom: 1px solid var(--border);
  overflow-wrap: anywhere;
}

th {
  color: var(--muted);
}

.table-wrap {
  overflow-x: auto;
}

canvas {
  display: block;
  width: 100%;
  height: 170px;
}

footer {
  color: var(--muted);
  text-align: center;
  font-size: 12px;
  margin-top: 25px;
}

@media(max-width: 600px) {
  body {
    padding: 14px;
  }

  h1 {
    font-size: 23px;
  }

  .card {
    padding: 15px;
  }
}
</style>
</head>

<body>

<header>
  <div>
    <h1>🖥️ SO Dashboard
      <span style="color:#60a5fa">4.0</span>
    </h1>
    <div class="subtitle">
      Monitoramento do sistema operacional
    </div>
  </div>

  <div>
    <span class="status" id="health">CONECTANDO...</span>
    <p class="muted" id="updated">Carregando dados...</p>
  </div>
</header>

<section class="kpis">

  <div class="card">
    <div class="kpi-label">Utilização da CPU</div>
    <div class="kpi-value" id="cpuValue">--%</div>
    <div class="bar">
      <div class="fill" id="cpuBar"></div>
    </div>
  </div>

  <div class="card">
    <div class="kpi-label">Memória RAM</div>
    <div class="kpi-value" id="ramValue">--%</div>
    <div class="bar">
      <div class="fill" id="ramBar"></div>
    </div>
    <div class="muted" id="ramDetails"></div>
  </div>

  <div class="card">
    <div class="kpi-label">Tempo ligado</div>
    <div class="kpi-value" id="uptimeValue">--</div>
    <div class="muted">Desde a inicialização</div>
  </div>

  <div class="card">
    <div class="kpi-label">Núcleos de CPU</div>
    <div class="kpi-value" id="coreValue">--</div>
    <div class="muted" id="ipValue">IP: --</div>
  </div>

</section>

<section class="grid">

  <div class="card">
    <h2>📈 Histórico de utilização</h2>
    <canvas id="chart" width="600" height="220"></canvas>
    <div class="muted">CPU e RAM — últimas medições</div>
  </div>

  <div class="card">
    <h2>⚙️ Processador</h2>
    <div id="cpuInfo"></div>
  </div>

  <div class="card">
    <h2>🧠 Memória</h2>
    <div id="memoryInfo"></div>
  </div>

  <div class="card">
    <h2>💻 Sistema operacional</h2>
    <div id="systemInfo"></div>
  </div>

  <div class="card">
    <h2>🔐 Processo Node.js</h2>
    <div id="processInfo"></div>
  </div>

  <div class="card">
    <h2>☁️ Ambiente</h2>
    <div id="environmentInfo"></div>
  </div>

  <div class="card">
    <h2>🌐 Interfaces de rede</h2>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Interface</th>
            <th>IP</th>
            <th>Família</th>
          </tr>
        </thead>
        <tbody id="networkTable"></tbody>
      </table>
    </div>
  </div>

  <div class="card">
    <h2>📂 Arquivos do diretório</h2>
    <div class="muted" id="fileCount"></div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Tamanho</th>
          </tr>
        </thead>
        <tbody id="filesTable"></tbody>
      </table>
    </div>
  </div>

</section>

<footer>
  SO Dashboard 4.0 • Sistemas Operacionais + Cloud Computing
  <p id="connection">Iniciando monitoramento...</p>
</footer>

<script>
const $ = id => document.getElementById(id);

function addInfo(id, items) {
  const container = $(id);
  container.replaceChildren();

  items.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "info";

    const left = document.createElement("span");
    left.textContent = label;

    const right = document.createElement("span");
    right.textContent = value ?? "N/A";

    row.append(left, right);
    container.appendChild(row);
  });
}

function setBar(id, value) {
  const bar = $(id);

  bar.style.width =
    Math.max(0, Math.min(100, value)) + "%";

  bar.className = "fill";

  if (value >= 90) {
    bar.classList.add("red");
  } else if (value >= 75) {
    bar.classList.add("orange");
  } else {
    bar.classList.add("green");
  }
}

function addRows(id, rows) {
  const body = $(id);
  body.replaceChildren();

  rows.forEach(values => {
    const tr = document.createElement("tr");

    values.forEach(value => {
      const td = document.createElement("td");
      td.textContent = value ?? "N/A";
      tr.appendChild(td);
    });

    body.appendChild(tr);
  });
}

const history = {
  cpu: [],
  ram: []
};

const maxPoints = 30;

function drawChart() {
  const canvas = $("chart");
  const ctx = canvas.getContext("2d");

  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = "#27344a";
  ctx.fillStyle = "#91a1b9";
  ctx.font = "12px Arial";

  for (let value = 0; value <= 100; value += 25) {
    const y = h - (value / 100) * (h - 20) - 10;

    ctx.beginPath();
    ctx.moveTo(35, y);
    ctx.lineTo(w - 10, y);
    ctx.stroke();

    ctx.fillText(value + "%", 2, y + 4);
  }

  [
    { data: history.cpu, color: "#60a5fa" },
    { data: history.ram, color: "#22c55e" }
  ].forEach(series => {
    if (series.data.length < 2) return;

    ctx.strokeStyle = series.color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    series.data.forEach((value, index) => {
      const x = 35 +
        index * (w - 45) / (maxPoints - 1);

      const y = h - (value / 100) * (h - 20) - 10;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  });
}

async function updateDashboard() {
  try {
    const response = await fetch("/api/status", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Erro HTTP " + response.status);
    }

    const data = await response.json();

    $("cpuValue").textContent =
      data.cpu.average + "%";

    $("ramValue").textContent =
      data.memory.percent + "%";

    $("uptimeValue").textContent =
      data.system.uptime;

    $("coreValue").textContent =
      data.cpu.count;

    $("ipValue").textContent =
      "IP: " + data.network.mainIP;

    $("ramDetails").textContent =
      data.memory.used + " GB usados de " +
      data.memory.total + " GB";

    setBar("cpuBar", data.cpu.average);
    setBar("ramBar", data.memory.percent);

    $("health").textContent = data.health.label;
    $("health").style.color = data.health.color;

    $("updated").textContent =
      "Atualizado: " + data.updatedAt;

    $("connection").textContent =
      "Conectado • Atualização a cada 5 segundos";

    history.cpu.push(data.cpu.average);
    history.ram.push(data.memory.percent);

    history.cpu = history.cpu.slice(-maxPoints);
    history.ram = history.ram.slice(-maxPoints);

    drawChart();

    addInfo("cpuInfo", [
      ["Modelo", data.cpu.model],
      ["Núcleos", data.cpu.count],
      ["Carga 1 min", data.cpu.load[0]],
      ["Carga 5 min", data.cpu.load[1]],
      ["Carga 15 min", data.cpu.load[2]]
    ]);

    addInfo("memoryInfo", [
      ["Total", data.memory.total + " GB"],
      ["Usada", data.memory.used + " GB"],
      ["Livre", data.memory.free + " GB"],
      ["Utilização", data.memory.percent + "%"]
    ]);

    addInfo("systemInfo", [
      ["Host", data.system.hostname],
      ["Sistema", data.system.type],
      ["Versão", data.system.release],
      ["Plataforma", data.system.platform],
      ["Arquitetura", data.system.architecture],
      ["Node.js", data.system.node],
      ["Fuso horário", data.system.timezone]
    ]);

    addInfo("processInfo", [
      ["PID", data.process.pid],
      ["Diretório", data.process.directory],
      ["Memória RSS", data.process.memory + " MB"],
      ["Executável", data.process.execPath],
      ["Tempo do processo", data.process.uptime]
    ]);

    addInfo("environmentInfo", [
      ["Ambiente", data.environment.cloud],
      ["Porta", data.environment.port],
      ["NODE_ENV", data.environment.nodeEnv]
    ]);

    addRows("networkTable",
      data.network.interfaces.map(ip => [
        ip.interface,
        ip.address,
        ip.family
      ])
    );

    addRows("filesTable",
      data.files.map(file => [
        file.name,
        file.type,
        file.size
      ])
    );

    $("fileCount").textContent =
      data.files.length + " itens exibidos (máximo de 30)";

  } catch (error) {
    $("connection").textContent =
      "Falha de conexão. Tentando novamente...";

    console.error("Erro no monitoramento:", error);
  }
}

updateDashboard();
setInterval(updateDashboard, 5000);
</script>

</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(
    "SO Dashboard 4.0 rodando na porta " + PORT
  );
});
