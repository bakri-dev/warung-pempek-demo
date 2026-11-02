// Ganti dengan nomor WhatsApp usaha (format internasional, tanpa tanda +)
var NOMOR_WA = "6281234567890";

var MENU = [
  { id: 1, nama: "Pempek Kapal Selam", kat: "Pempek",  harga: 18000, desc: "Isi telur ayam, disajikan dengan cuko.", warna: "#B8341F" },
  { id: 2, nama: "Pempek Lenjer",      kat: "Pempek",  harga: 14000, desc: "Bentuk panjang, kenyal dan gurih.",      warna: "#C9692B" },
  { id: 3, nama: "Pempek Adaan",       kat: "Pempek",  harga: 10000, desc: "Bulat dan goreng, renyah di luar.",      warna: "#A8742C" },
  { id: 4, nama: "Tekwan",             kat: "Kuah",    harga: 16000, desc: "Bakso ikan dalam kuah udang, jamur, dan bengkoang.", warna: "#3F7A6B" },
  { id: 5, nama: "Model",              kat: "Kuah",    harga: 16000, desc: "Tahu isi pempek dalam kuah hangat.",     warna: "#2F6A8C" },
  { id: 6, nama: "Es Kacang Merah",    kat: "Minuman", harga: 12000, desc: "Kacang merah, susu, dan sirup.",         warna: "#8E3B5A" },
  { id: 7, nama: "Teh Es",             kat: "Minuman", harga: 5000,  desc: "Teh dingin yang menyegarkan.",           warna: "#6B5B2E" }
];

var cart = {};            // { id: jumlah }
var kategori = "Semua";

var $ = function (id) { return document.getElementById(id); };
var rp = function (n) { return "Rp" + n.toLocaleString("id-ID"); };

function renderTabs() {
  var kats = ["Semua"].concat(MENU.map(function (m) { return m.kat; }).filter(function (k, i, a) { return a.indexOf(k) === i; }));
  var el = $("tabs"); el.textContent = "";
  kats.forEach(function (k) {
    var b = document.createElement("button");
    b.type = "button"; b.textContent = k;
    b.setAttribute("aria-pressed", k === kategori ? "true" : "false");
    b.addEventListener("click", function () { kategori = k; renderTabs(); renderMenu(); });
    el.appendChild(b);
  });
}

function renderMenu() {
  var g = $("grid"); g.textContent = "";
  MENU.filter(function (m) { return kategori === "Semua" || m.kat === kategori; }).forEach(function (m) {
    var card = document.createElement("article"); card.className = "item";
    var th = document.createElement("div"); th.className = "thumb"; th.style.background = m.warna; th.textContent = m.nama.charAt(0);
    th.setAttribute("aria-hidden", "true");
    var body = document.createElement("div"); body.className = "item-body";
    var h = document.createElement("h3"); h.textContent = m.nama;
    var p = document.createElement("p"); p.textContent = m.desc;
    var pr = document.createElement("div"); pr.className = "price"; pr.textContent = rp(m.harga);
    var btn = document.createElement("button"); btn.type = "button"; btn.className = "btn"; btn.textContent = "Tambah";
    btn.addEventListener("click", function () { cart[m.id] = (cart[m.id] || 0) + 1; update(); });
    body.append(h, p, pr, btn); card.append(th, body); g.appendChild(card);
  });
}

function update() {
  var ids = Object.keys(cart).filter(function (id) { return cart[id] > 0; });
  var jumlah = 0, total = 0, baris = [];
  var ul = $("list"); ul.textContent = "";
  if (!ids.length) { var e = document.createElement("li"); e.className = "empty"; e.textContent = "Belum ada pesanan."; ul.appendChild(e); }
  ids.forEach(function (id) {
    var m = MENU.filter(function (x) { return x.id == id; })[0], q = cart[id];
    jumlah += q; total += m.harga * q; baris.push("- " + m.nama + " x" + q + " = " + rp(m.harga * q));
    var li = document.createElement("li");
    var nama = document.createElement("span"); nama.textContent = m.nama;
    var qty = document.createElement("span"); qty.className = "qty";
    var minus = document.createElement("button"); minus.type = "button"; minus.textContent = "−"; minus.setAttribute("aria-label", "Kurangi " + m.nama);
    var n = document.createElement("span"); n.textContent = q;
    var plus = document.createElement("button"); plus.type = "button"; plus.textContent = "+"; plus.setAttribute("aria-label", "Tambah " + m.nama);
    minus.addEventListener("click", function () { cart[id]--; update(); });
    plus.addEventListener("click", function () { cart[id]++; update(); });
    qty.append(minus, n, plus); li.append(nama, qty); ul.appendChild(li);
  });
  $("count").textContent = jumlah;
  $("total").textContent = rp(total);
  var wa = $("wa");
  if (!jumlah) { wa.classList.add("disabled"); wa.removeAttribute("href"); }
  else {
    wa.classList.remove("disabled");
    var teks = "Halo, saya mau pesan:\n" + baris.join("\n") + "\nTotal: " + rp(total);
    wa.href = "https://wa.me/" + NOMOR_WA + "?text=" + encodeURIComponent(teks);
  }
}

$("cartBtn").addEventListener("click", function () { $("dlg").showModal(); });
$("close").addEventListener("click", function () { $("dlg").close(); });
renderTabs(); renderMenu(); update();
