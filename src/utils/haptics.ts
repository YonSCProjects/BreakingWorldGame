// Progressive enhancement only. Works on most Android browsers; iOS Safari
// ignores navigator.vibrate entirely — never treat haptics as load-bearing.
function canVibrate(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function'
}

export function hapticLight() {
  if (canVibrate()) navigator.vibrate(18)
}

export function hapticMedium() {
  if (canVibrate()) navigator.vibrate(40)
}

export function hapticReject() {
  if (canVibrate()) navigator.vibrate([30, 60, 30])
}

// The seal: a building rumble that resolves in a hard snap.
export function hapticSeal() {
  if (canVibrate()) navigator.vibrate([20, 30, 40, 30, 90, 40, 220])
}
