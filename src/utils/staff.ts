// Staff/dev mode: reveals the TEST INJECTOR (a cheat that adds atoms without
// scanning a real card) and other run-the-event tools. OFF for players.
//
// Enabled when the URL has ?staff, or on localhost during development. So the
// public event link hides it, but staff can open `…/?staff` to demo, test on a
// camera-less laptop, or rescue a team whose physical QR won't scan.
export const STAFF_MODE: boolean =
  typeof location !== 'undefined' &&
  (/[?&]staff\b/i.test(location.search) ||
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1')
