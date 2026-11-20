// ゲーム本体（src/hikari-puzzle.html）に ads-bridge.js を差し込んで www/index.html を作る
const fs = require("fs"), path = require("path");
const src = path.join(__dirname, "src", "hikari-puzzle.html");
if (!fs.existsSync(src)) { console.error("src/hikari-puzzle.html がありません。ゲームのファイルをここに置いてください。"); process.exit(1); }
let html = fs.readFileSync(src, "utf8");
const bridge = fs.readFileSync(path.join(__dirname, "ads-bridge.js"), "utf8");
if (!html.includes("</head>")) { console.error("</head> が見つかりません"); process.exit(1); }
html = html.replace("</head>", "<script>\n" + bridge + "\n</script>\n</head>");
fs.mkdirSync(path.join(__dirname, "www"), { recursive: true });
fs.writeFileSync(path.join(__dirname, "www", "index.html"), html);
console.log("OK: www/index.html を作りました（" + Math.round(html.length / 1024) + " KB）");
