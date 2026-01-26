const PROXY = "https://r.jina.ai/http://";
let lastReport = null;

const $ = id => document.getElementById(id);

function toggleTheme(){
  const r = document.documentElement;
  r.setAttribute(
    "data-theme",
    r.getAttribute("data-theme")==="dark" ? "light" : "dark"
  );
}

function toggleLab(){
  $("lab").classList.toggle("hidden");
}

function setProgress(p){
  $("bar").style.width = p + "%";
}

function clean(d){
  return d.trim().replace(/^https?:\/\//,'').replace(/\/+$/,'');
}

/* ===== CORE SCAN ===== */
async function run(){
  const domain = clean($("target").value);
  if(!domain) return;

  setProgress(10);
  $("output").innerHTML = "Scanning…";

  try{
    const r = await fetch(PROXY + "http://" + domain);
    const text = await r.text();

    lastReport = {
      domain,
      status: r.status,
      https: r.url.startsWith("https"),
      length: text.length
    };

    $("output").innerHTML = `
      Status: <b>${r.status}</b><br>
      HTTPS: <b>${lastReport.https}</b><br>
      Size: <b>${text.length}</b>
    `;

    $("details").textContent = text.slice(0,800);
    saveHistory(lastReport);
    setProgress(100);

  }catch(e){
    $("output").textContent = "Scan failed";
    setProgress(0);
  }
}

/* ===== LAB ===== */
async function labTest(){
  const domain = clean($("target").value);
  if(!domain) return;

  const ep = $("labEndpoint").value;
  const payload = $("labPayload").value;
  const method = $("labMethod").value;

  let url = PROXY + "http://" + domain + ep;

  try{
    const opt = method==="POST"
      ? {method:"POST", body:payload}
      : {};

    if(method==="GET") url += encodeURIComponent(payload);

    const r = await fetch(url, opt);
    const t = await r.text();

    $("labOut").textContent = t.slice(0,800);
  }catch{
    $("labOut").textContent = "Lab request failed";
  }
}

/* ===== STORAGE ===== */
function saveHistory(r){
  const h = JSON.parse(localStorage.getItem("orca")||"[]");
  h.unshift({time:new Date().toISOString(), r});
  localStorage.setItem("orca", JSON.stringify(h.slice(0,10)));
  renderHistory();
}

function renderHistory(){
  const h = JSON.parse(localStorage.getItem("orca")||"[]");
  $("historyOut").textContent =
    h.map(x=>`${x.time} — ${x.r.domain}`).join("\n") || "No history";
}

function clearHistory(){
  localStorage.removeItem("orca");
  renderHistory();
}

function exportReport(){
  if(!lastReport) return alert("No report");
  const blob = new Blob([JSON.stringify(lastReport,null,2)]);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "orca_report.json";
  a.click();
}
