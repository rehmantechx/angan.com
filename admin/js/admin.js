// Anngan dashboard, Phase 1, Day 1-2. Plain JavaScript, no framework.
// Data comes from admin/js/data.js. Changes are saved in this browser only
// (localStorage) until Firebase is connected in Day 3-4. See
// admin/js/firebase-config.js, which is a placeholder and is not live.
(function () {
  "use strict";
  var LS_LIST = "anngan-admin-listings-v1";
  var LS_ENQ = "anngan-admin-enquiries-v1";
  var IMG = "../assets/img/";
  var STAGES = ["New", "Called", "Visit", "Deal Done"];
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function load(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
  var listings = load(LS_LIST, null);
  if (!listings || !listings.length) { listings = ANNGAN_DATA.listings.slice(); save(LS_LIST, listings); }
  var enquiries = load(LS_ENQ, null);
  if (!enquiries || !enquiries.length) { enquiries = ANNGAN_DATA.enquiriesExample.slice(); save(LS_ENQ, enquiries); }
  var projects = ANNGAN_DATA.projects, blogs = ANNGAN_DATA.blogsNewest,
      partners = ANNGAN_DATA.partners, services = ANNGAN_DATA.services;
  var state = { pane: "overview", q: "", listFilter: "all", enqFilter: "all" };

  // Pane switching
  document.querySelectorAll(".nav button[data-pane]").forEach(function (b) {
    b.addEventListener("click", function () { showPane(b.getAttribute("data-pane")); });
  });
  function showPane(name) {
    state.pane = name;
    document.querySelectorAll(".pane").forEach(function (p) { p.classList.toggle("on", p.id === "pane-" + name); });
    document.querySelectorAll(".nav button[data-pane]").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-pane") === name); });
    var titles = { overview: "Overview", listings: "Listings", projects: "Projects", enquiries: "New Enquiries", agencies: "Agencies", blogs: "Blogs", tech: "Angan Tech", users: "Who Can Log In", settings: "Settings" };
    $("pageTitle").textContent = titles[name] || "Overview";
    window.scrollTo(0, 0);
  }
  window.showPane = showPane;

  // Search
  $("topSearch").addEventListener("input", function () {
    state.q = this.value.trim().toLowerCase();
    renderAll();
    if (state.pane === "overview" && state.q) { showPane("listings"); }
  });

  function matches(l, q) {
    if (!q) return true;
    return (l.title + " " + l.city + " " + l.loc + " " + l.price + " " + l.size).toLowerCase().indexOf(q) >= 0;
  }
  function stageTag(s) {
    if (s === "New") return '<span class="tag red">New, not called yet</span>';
    if (s === "Called") return '<span class="tag blue">Called</span>';
    if (s === "Visit") return '<span class="tag">Visit booked</span>';
    return '<span class="tag green">Deal Done</span>';
  }
  function photoCell(l) {
    if (l.img) return '<span class="thumb-wrap"><img class="thumb" src="' + IMG + esc(l.img) + '" alt="' + esc(l.title) + '" loading="lazy"><span><b>' + esc(l.title) + '</b><span>' + l.beds + ' beds, ' + l.baths + ' baths, ' + esc(l.size) + ', ' + esc(l.type) + '</span></span></span>';
    return '<span class="thumb-wrap"><span class="no-photo">No photo</span><span><b>' + esc(l.title) + '</b><span>' + l.beds + ' beds, ' + l.baths + ' baths, ' + esc(l.size) + ', ' + esc(l.type) + '</span></span></span>';
  }

  function renderOverview() {
    var sale = listings.filter(function (l) { return l.status === "sale"; }).length;
    var rent = listings.filter(function (l) { return l.status === "rent"; }).length;
    $("kpiListings").textContent = listings.length;
    $("kpiProjects").textContent = projects.length;
    $("kpiEnquiries").textContent = enquiries.length;
    $("kpiSaleRent").textContent = sale + " / " + rent;
    var counts = STAGES.map(function (s) { return enquiries.filter(function (e) { return e.stage === s; }).length; });
    var max = Math.max.apply(null, counts.concat([1]));
    $("stageBars").innerHTML = STAGES.map(function (s, i) {
      return '<div class="bar-col"><i style="height:' + Math.round(counts[i] / max * 80 + 8) + 'px"></i><b>' + counts[i] + '</b><br>' + s + '</div>';
    }).join("");
    $("stageCounts").textContent = "New " + counts[0] + "  |  Called " + counts[1] + "  |  Visit " + counts[2] + "  |  Deal Done " + counts[3];
    $("recentEnquiries").innerHTML = enquiries.slice(0, 4).map(function (e) {
      return '<tr><td data-label="Person"><b>' + esc(e.name) + '</b><br><span style="color:#6B7280">' + esc(e.phone) + '</span></td><td data-label="Asked about">' + esc(e.asked) + '</td><td data-label="How they contacted you">' + esc(e.how) + '</td><td data-label="Where it stands">' + stageTag(e.stage) + '</td><td data-label="Open" class="row-actions"><button class="btn btn-line btn-sm" data-open-enq="' + esc(e.id) + '">Open</button></td></tr>';
    }).join("");
    $("latestListings").innerHTML = listings.slice(0, 5).map(function (l) {
      return '<tr class="' + (l.hidden ? "hidden-row" : "") + '"><td data-label="Property">' + photoCell(l) + '</td><td data-label="City">' + esc(l.city) + '</td><td data-label="For sale or rent">' + (l.status === "sale" ? "For Sale" : "For Rent") + '</td><td data-label="Price" class="price">' + esc(l.price) + '</td><td data-label="On website">' + (l.hidden ? '<span class="tag grey">Hidden</span>' : '<span class="tag green">Live</span>') + '</td><td data-label="Actions" class="row-actions"><button class="btn btn-line btn-sm" data-view="' + esc(l.id) + '">View</button><button class="btn btn-line btn-sm" data-edit="' + esc(l.id) + '">Edit</button></td></tr>';
    }).join("");
    $("needsAction").innerHTML = enquiries.filter(function (e) { return e.stage === "New"; }).map(function (e) {
      return "<li><b>" + esc(e.name) + "</b>, " + esc(e.asked) + " (" + esc(e.how) + "). Next: " + esc(e.next) + ".</li>";
    }).join("") || "<li>No new enquiries waiting for a call.</li>";
  }

  function renderListings() {
    var rows = listings.filter(function (l) {
      if (state.listFilter === "sale" && l.status !== "sale") return false;
      if (state.listFilter === "rent" && l.status !== "rent") return false;
      if (state.listFilter === "hidden" && !l.hidden) return false;
      return matches(l, state.q);
    });
    $("listCount").textContent = rows.length + " of " + listings.length + " listings";
    $("listingsBody").innerHTML = rows.map(function (l) {
      return '<tr class="' + (l.hidden ? "hidden-row" : "") + '"><td data-label="Property">' + photoCell(l) + '</td><td data-label="City">' + esc(l.city) + '</td><td data-label="For sale or rent">' + (l.status === "sale" ? "For Sale" : "For Rent") + '</td><td data-label="Price" class="price">' + esc(l.price) + '</td><td data-label="On website">' + (l.hidden ? '<span class="tag grey">Hidden</span>' : '<span class="tag green">Live</span>') + '</td><td data-label="Actions" class="row-actions"><button class="btn btn-line btn-sm" data-view="' + esc(l.id) + '">View</button><button class="btn btn-line btn-sm" data-edit="' + esc(l.id) + '">Edit</button><button class="btn btn-line btn-sm" data-hide="' + esc(l.id) + '">' + (l.hidden ? "Show" : "Hide") + '</button><button class="btn btn-line btn-sm" data-del="' + esc(l.id) + '">Delete</button></td></tr>';
    }).join("") || '<tr><td colspan="6">No listings match this search. Try a different word, or clear the search.</td></tr>';
  }

  function renderProjects() {
    $("projectsGrid").innerHTML = projects.map(function (p) {
      var img = p.img ? '<img src="' + IMG + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy">' : '<div class="no-photo" style="width:100%;height:130px;font-size:14px">No photo yet<br>996 shops, 54 acres</div>';
      return '<div class="tile">' + img + '<h3>' + esc(p.name) + '</h3><p>' + esc(p.loc) + ' | ' + esc(p.note) + '</p><a class="btn btn-line btn-sm" href="../' + esc(p.page) + '" target="_blank" rel="noopener">Open project page</a></div>';
    }).join("");
  }

  function renderEnquiries() {
    var rows = enquiries.filter(function (e) {
      if (state.enqFilter !== "all" && e.stage !== state.enqFilter) return false;
      if (state.q && (e.name + " " + e.asked + " " + e.how).toLowerCase().indexOf(state.q) < 0) return false;
      return true;
    });
    $("enqCount").textContent = rows.length + " of " + enquiries.length + " enquiries";
    $("stageCards").innerHTML = STAGES.map(function (s) {
      var n = enquiries.filter(function (e) { return e.stage === s; }).length;
      var what = { "New": "New, not called yet", "Called": "You called them", "Visit": "They came to see it", "Deal Done": "They bought or rented it" }[s];
      return '<div class="stage"><b>' + n + '</b><span>' + s + '</span><p style="margin:6px 0 0;color:#6B7280;font-size:13px">' + what + '</p><button class="btn btn-line btn-sm" data-stage-filter="' + s + '">Show ' + s + '</button></div>';
    }).join("");
    $("enquiriesBody").innerHTML = rows.map(function (e) {
      return '<tr><td data-label="Person"><b>' + esc(e.name) + '</b><br><span style="color:#6B7280">' + esc(e.phone) + '</span></td><td data-label="Asked about">' + esc(e.asked) + '</td><td data-label="How they contacted you">' + esc(e.how) + '</td><td data-label="Where it stands">' + stageTag(e.stage) + '<br><span style="color:#6B7280;font-size:13px">Next: ' + esc(e.next) + '</span></td><td data-label="Open" class="row-actions"><button class="btn btn-line btn-sm" data-open-enq="' + esc(e.id) + '">Open</button></td></tr>';
    }).join("") || '<tr><td colspan="5">No enquiries in this stage yet.</td></tr>';
  }

  function renderAgencies() {
    $("agenciesGrid").innerHTML = partners.map(function (p) {
      return '<div class="logo-tile"><img src="' + IMG + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy"><b>' + esc(p.name) + '</b></div>';
    }).join("");
  }
  function renderBlogs() {
    $("blogsBody").innerHTML = blogs.map(function (b) {
      return '<tr><td data-label="Date">' + esc(b.date) + '</td><td data-label="Title">' + esc(b.title) + '</td><td data-label="Read" class="row-actions"><a class="btn btn-line btn-sm" href="' + esc(b.url) + '" target="_blank" rel="noopener">Read on anngan.com</a></td></tr>';
    }).join("");
  }
  function renderTech() {
    $("techGrid").innerHTML = services.map(function (s) {
      return '<div class="tile"><h3>' + esc(s.name) + '</h3><p>' + esc(s.note) + '</p><a class="btn btn-line btn-sm" href="../' + esc(s.page) + '" target="_blank" rel="noopener">Open page</a></div>';
    }).join("");
    $("techCount").textContent = services.length + " services";
  }
  function renderAll() { renderOverview(); renderListings(); renderProjects(); renderEnquiries(); renderAgencies(); renderBlogs(); renderTech(); }

  // Filters
  document.querySelectorAll("[data-list-filter]").forEach(function (b) {
    b.addEventListener("click", function () {
      state.listFilter = b.getAttribute("data-list-filter");
      document.querySelectorAll("[data-list-filter]").forEach(function (x) { x.classList.toggle("on", x === b); });
      renderListings();
    });
  });
  document.addEventListener("click", function (e) {
    var t = e.target;
    var sf = t.getAttribute && t.getAttribute("data-stage-filter");
    if (sf) { state.enqFilter = sf; renderEnquiries(); return; }
    var view = t.getAttribute && t.getAttribute("data-view");
    if (view) { var l = listings.find(function (x) { return x.id === view; }); if (l) window.open(l.url, "_blank"); return; }
    var edit = t.getAttribute && t.getAttribute("data-edit");
    if (edit) { openForm(edit); return; }
    var hide = t.getAttribute && t.getAttribute("data-hide");
    if (hide) { var lh = listings.find(function (x) { return x.id === hide; }); if (lh) { lh.hidden = !lh.hidden; save(LS_LIST, listings); renderAll(); } return; }
    var del = t.getAttribute && t.getAttribute("data-del");
    if (del) { if (confirm("Delete this listing from the dashboard? This only changes the dashboard copy in this browser for now.")) { listings = listings.filter(function (x) { return x.id !== del; }); save(LS_LIST, listings); renderAll(); } return; }
    var open = t.getAttribute && t.getAttribute("data-open-enq");
    if (open) { openEnquiry(open); return; }
  });

  // Add / Edit listing form
  var editingId = null;
  function openForm(id) {
    editingId = id || null;
    var l = id ? listings.find(function (x) { return x.id === id; }) : null;
    $("formTitle").textContent = l ? "Edit listing" : "Add a listing";
    $("fTitle").value = l ? l.title : "";
    $("fPrice").value = l ? l.price : "";
    $("fCity").value = l ? l.city : "Lahore";
    $("fBeds").value = l ? l.beds : 3;
    $("fBaths").value = l ? l.baths : 3;
    $("fSize").value = l ? l.size : "5 Marla";
    $("fType").value = l ? l.type : "House";
    $("fStatus").value = l ? l.status : "sale";
    $("fLoc").value = l ? l.loc : "";
    $("listingModal").classList.add("open");
  }
  $("addBtn").addEventListener("click", function () { openForm(null); });
  $("addBtn2") && $("addBtn2").addEventListener("click", function () { openForm(null); });
  $("closeForm").addEventListener("click", function () { $("listingModal").classList.remove("open"); });
  $("listingModal").addEventListener("click", function (e) { if (e.target === this) this.classList.remove("open"); });
  $("listingForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var price = $("fPrice").value.trim();
    var item = {
      id: editingId || ("new-" + Date.now()),
      title: $("fTitle").value.trim(),
      price: price,
      n: parseInt(price.replace(/[^0-9]/g, ""), 10) || 0,
      beds: parseInt($("fBeds").value, 10) || 0,
      baths: parseInt($("fBaths").value, 10) || 0,
      size: $("fSize").value.trim(),
      city: $("fCity").value,
      loc: $("fLoc").value.trim() || $("fCity").value,
      type: $("fType").value,
      status: $("fStatus").value,
      img: "",
      badge: $("fStatus").value === "sale" ? "For Sale" : "For Rent",
      url: "https://anngan.com/"
    };
    if (!item.title || !item.price) { alert("Please fill in the title and the price."); return; }
    if (editingId) {
      var i = listings.findIndex(function (x) { return x.id === editingId; });
      if (i >= 0) { item.img = listings[i].img; item.url = listings[i].url; item.hidden = listings[i].hidden; listings[i] = item; }
    } else { listings.unshift(item); }
    save(LS_LIST, listings);
    $("listingModal").classList.remove("open");
    renderAll(); showPane("listings");
  });
  $("resetData") && $("resetData").addEventListener("click", function () {
    if (confirm("Reset listings and enquiries to the real data from anngan.com? Your changes in this browser will be removed.")) {
      listings = ANNGAN_DATA.listings.slice(); enquiries = ANNGAN_DATA.enquiriesExample.slice();
      save(LS_LIST, listings); save(LS_ENQ, enquiries); renderAll();
    }
  });

  // Enquiry detail: move to next stage
  function openEnquiry(id) {
    var e = enquiries.find(function (x) { return x.id === id; });
    if (!e) return;
    var idx = STAGES.indexOf(e.stage);
    var next = idx < STAGES.length - 1 ? STAGES[idx + 1] : null;
    var msg = e.name + ", " + e.phone + ".\nAsked about: " + e.asked + ".\nHow they contacted you: " + e.how + ".\nWhere it stands: " + e.stage + ".\nNext: " + e.next + ".";
    if (next) {
      if (confirm(msg + "\n\nMove this enquiry to " + next + "?")) {
        e.stage = next; save(LS_ENQ, enquiries); renderAll();
      }
    } else { alert(msg + "\n\nThis deal is done."); }
  }

  renderAll();
})();
