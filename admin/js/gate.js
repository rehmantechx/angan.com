// Anngan dashboard access gate, TEMPORARY, Phase 1.
// Firebase login replaces this in Day 3-4. This gate only stops a
// casual visitor opening the dashboard in this browser. It is NOT
// real security: anyone who can read this file can read the code.
// CHANGE THIS: set OFFICE_PASSCODE to a code only the office team
// knows, before you share the dashboard link. Do not use a password
// you use anywhere else. When Firebase login is connected, delete
// this file and the login page redirect.
var OFFICE_PASSCODE = "CHANGE-THIS-CODE";
function adminLoggedIn() {
  try { return sessionStorage.getItem("anngan-admin-ok") === "1"; } catch (e) { return false; }
}
function adminLogout() {
  try { sessionStorage.removeItem("anngan-admin-ok"); } catch (e) {}
  window.location.href = "login.html";
}
// On the dashboard itself, send anyone who has not logged in to the login page.
if (typeof window !== "undefined" && window.location.pathname.indexOf("/admin/index.html") >= 0 || (typeof window !== "undefined" && /\/admin\/?$/.test(window.location.pathname))) {
  if (!adminLoggedIn()) { window.location.replace("login.html"); }
}
