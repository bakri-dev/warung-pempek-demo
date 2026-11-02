// Ganti dengan nomor WhatsApp usaha (format internasional, tanpa tanda +)
var NOMOR_WA = "6281234567890";

var MENU = [
  { id: "m1",  nama: "Pempek Kapal Selam", kat: "Pempek",  harga: 18000, desc: "Isi telur ayam, disajikan dengan cuko.", warna: "#B8341F" },
  { id: "m2",  nama: "Pempek Lenjer",      kat: "Pempek",  harga: 14000, desc: "Bentuk panjang, kenyal dan gurih.",      warna: "#C9692B" },
  { id: "m3",  nama: "Pempek Adaan",       kat: "Pempek",  harga: 10000, desc: "Bulat dan goreng, renyah di luar.",      warna: "#A8742C" },
  { id: "m4",  nama: "Pempek Keriting",    kat: "Pempek",  harga: 12000, desc: "Bertekstur keriting, garing di pinggir.", warna: "#9C4A2B" },
  { id: "m5",  nama: "Pempek Pistel",      kat: "Pempek",  harga: 15000, desc: "Isi pepaya muda tumis yang gurih.",       warna: "#7F5B24" },
  { id: "m6",  nama: "Tekwan",             kat: "Kuah",    harga: 16000, desc: "Bakso ikan dalam kuah udang, jamur, dan bengkoang.", warna: "#3F7A6B" },
  { id: "m7",  nama: "Model",              kat: "Kuah",    harga: 16000, desc: "Tahu isi pempek dalam kuah hangat.",      warna: "#2F6A8C" },
  { id: "m8",  nama: "Laksan",             kat: "Kuah",    harga: 17000, desc: "Pempek dalam kuah santan yang gurih.",    warna: "#4C7A4A" },
  { id: "m9",  nama: "Es Kacang Merah",    kat: "Minuman", harga: 12000, desc: "Kacang merah, susu, dan sirup.",          warna: "#8E3B5A" },
  { id: "m10", nama: "Teh Es",             kat: "Minuman", harga: 5000,  desc: "Teh dingin yang menyegarkan.",            warna: "#6B5B2E" },
  { id: "m11", nama: "Kemplang Panggang",  kat: "Camilan", harga: 15000, desc: "Kerupuk ikan panggang yang renyah.",      warna: "#8A6A2F" }
];

var PAKET = [
  { id: "p1", nama: "Paket Keluarga", untuk: "Untuk 4–5 orang",  harga: 110000, isi: ["5 Pempek Kapal Selam", "5 Pempek Lenjer", "1 botol cuko"] },
  { id: "p2", nama: "Paket Arisan",   untuk: "Untuk 10 orang",   harga: 290000, isi: ["10 Pempek Kapal Selam", "10 Pempek Lenjer", "10 Pempek Adaan", "2 botol cuko"] },
  { id: "p3", nama: "Paket Kantor",   untuk: "Untuk 15 orang",   harga: 420000, isi: ["15 Pempek Kapal Selam", "15 Pempek Lenjer", "15 Pempek Adaan", "15 Teh Es", "3 botol cuko"] }
];

var ALL = {};
MENU.concat(PAKET).forEach(function (m) { ALL[m.id] = m; });

var cart = {};
var kategori = "Semua";

var $ = function (id) { return document.getElementById(id); };
var rp = function (n) { return "Rp" + n.toLocaleString("id-ID"); };
function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
function tambahBtn(id, label) {
  var b = el("button", "btn", label); b.type = "button";
  b.addEventListener("click", function () { cart[id] = (cart[id] || 0) + 1; update(); });
  return b;
}

function renderTabs() {
  var kats = ["Semua"].concat(MENU.map(function (m) { return m.kat; }).filter(function (k, i, a) { return a.indexOf(k) === i; }));
  var box = $("tabs"); box.textContent = "";
  kats.forEach(function (k) {
    var b = el("button", null, k); b.type = "button";
    b.setAttribute("aria-pressed", k === kategori ? "true" : "false");
    b.addEventListener("click", function () { kategori = k; renderTabs(); renderMenu(); });
    box.appendChild(b);
  });
}

function renderMenu() {
  var g = $("grid"); g.textContent = "";
  MENU.filter(function (m) { return kategori === "Semua" || m.kat === kategori; }).forEach(function (m) {
    var card = el("article", "item");
    var th = el("div", "thumb", m.nama.charAt(0)); th.style.background = m.warna; th.setAttribute("aria-hidden", "true");
    var body = el("div", "item-body");
    body.append(el("h3", null, m.nama), el("p", null, m.desc), el("div", "price", rp(m.harga)), tambahBtn(m.id, "Tambah"));
    card.append(th, body); g.appendChild(card);
  });
}

function renderPaket() {
  var box = $("pakets"); box.textContent = "";
  PAKET.forEach(function (p) {
    var card = el("article", "paket");
    var ul = el("ul"); p.isi.forEach(function (i) { ul.appendChild(el("li", null, i)); });
    card.append(el("h3", null, p.nama), el("div", "for", p.untuk), ul, el("div", "price", rp(p.harga)), tambahBtn(p.id, "Pesan paket"));
    box.appendChild(card);
  });
}

function update() {
  var ids = Object.keys(cart).filter(function (id) { return cart[id] > 0; });
  var jumlah = 0, total = 0, baris = [];
  var ul = $("list"); ul.textContent = "";
  if (!ids.length) ul.appendChild(el("li", "empty", "Belum ada pesanan."));
  ids.forEach(function (id) {
    var m = ALL[id], q = cart[id];
    jumlah += q; total += m.harga * q; baris.push("- " + m.nama + " x" + q + " = " + rp(m.harga * q));
    var li = el("li"), qty = el("span", "qty");
    var minus = el("button", null, "−"); minus.type = "button"; minus.setAttribute("aria-label", "Kurangi " + m.nama);
    var plus = el("button", null, "+"); plus.type = "button"; plus.setAttribute("aria-label", "Tambah " + m.nama);
    minus.addEventListener("click", function () { cart[id]--; update(); });
    plus.addEventListener("click", function () { cart[id]++; update(); });
    qty.append(minus, el("span", null, q), plus); li.append(el("span", null, m.nama), qty); ul.appendChild(li);
  });
  $("count").textContent = jumlah;
  $("total").textContent = rp(total);
  var wa = $("wa");
  if (!jumlah) { wa.classList.add("disabled"); wa.removeAttribute("href"); }
  else {
    wa.classList.remove("disabled");
    wa.href = "https://wa.me/" + NOMOR_WA + "?text=" + encodeURIComponent("Halo, saya mau pesan:\n" + baris.join("\n") + "\nTotal: " + rp(total));
  }
}

$("cartBtn").addEventListener("click", function () { $("dlg").showModal(); });
$("close").addEventListener("click", function () { $("dlg").close(); });

// hamburger
var top_ = $("top"), burger = $("burger");
function setOpen(o) { top_.classList.toggle("open", o); burger.setAttribute("aria-expanded", o ? "true" : "false"); burger.setAttribute("aria-label", o ? "Tutup menu" : "Buka menu"); }
burger.addEventListener("click", function () { setOpen(!top_.classList.contains("open")); });
document.querySelectorAll("#nav a").forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
window.addEventListener("resize", function () { if (window.innerWidth > 860) setOpen(false); });

renderTabs(); renderMenu(); renderPaket(); update();
