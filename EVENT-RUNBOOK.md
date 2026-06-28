# The Lattice — Event-Day Runbook (what could go wrong & what to do)

## 🛠️ The 4 universal rescue tools (90% of problems)
1. **`?staff` injector** (keep open on the **ops phone**) — adds any atom to any
   team **without a card**. Fixes: lost scan, missing/un-scannable card, stuck
   team, atom shortage, catching a team up after a reset.
2. **Reopen the badge link** (or close the app → reopen) — a device's team state
   lives on the **server**, so reopening always rejoins with progress intact.
   Fixes: frozen phone, stale cache, wrong room, a kid who hit back/refresh.
3. **The hotspot** — switch all phones + laptop to it if the venue WiFi misbehaves.
4. **The Seer's dashboard tally** (e.g. `H 1/2`) — the **source of truth** for what
   a team actually has and what's missing. Trust it over what a kid says.

> **Golden recovery rule:** *Server holds the truth.* Almost nothing is ever
> "lost" — reopen, re-join, or inject. The only thing that truly wipes progress is
> **Reset** (see below) — so guard it.

---

## ✅ Before the kids arrive (highest-leverage prevention)
- [ ] **Test on the ACTUAL kids' WiFi with a FRESH phone** — confirm two devices
      sync a scan and there's **no captive-portal "accept" page**. If there is one,
      run the whole event on the **phone hotspot** instead (no portal).
- [ ] **Hotspot ready**: named, password taped to the laptop, the hotspot phone
      **plugged into power**, and tested (laptop + 2 phones join a room over it).
- [ ] **Do NOT deploy** the app or worker this morning (avoids stale-cache + outage
      risk). Confirm the backend is up: open
      `https://lattice-rooms.yon-level.workers.dev/health` → should say
      *"Lattice rooms online."*
- [ ] **Warm all 3 rooms**: open EAGLE, DOLPHIN, LION dashboards once (wakes the
      servers so the first real scan isn't slow), then **reset each to a clean
      slate** just before start.
- [ ] **Every field phone**: charged, **camera allowed** + one test scan, **volume
      UP + silent switch OFF**, one screen tap (unlocks audio), auto-lock set long
      (5 min), Low-Power-Mode off. Add the page to the home screen if you can.
- [ ] **Seer laptops**: plugged in, **never-sleep / never-lock**, clock correct,
      charger at the station.
- [ ] **Use badge deep-links only** for real stations (never the `?staff` custom
      cell — a typo makes a private empty room). Keep `?staff` on the **ops phone
      only**, not the Seer kids'.
- [ ] **Spares ready**: 1–2 charged spare phones, spare cards, power banks, strong
      tape, a **printed recipe cheat-sheet** (the ultimate manual fallback).

---

## 🚨 IF X HAPPENS → DO Y  (print this card for helpers)

| Symptom | Do this |
|---|---|
| **Phone stuck on "מתחבר…"** (one device) | Reopen the badge link. Still stuck → open `example.com`; if a WiFi login page shows, accept it. Still stuck → switch that phone to the **hotspot** (WiFi off/on). |
| **ALL teams frozen at once** | It's the network/uplink. Call a **60-sec "the Lattice is recharging"** pause. Toggle the hotspot off/on (or move it central). On each phone, WiFi off→on to force reconnect. State restores itself. |
| **Backend check fails** (`/health` not "online") | Backend is down — can't fix live. Switch to **manual paper hunt**: kids gather cards, a guide checks the recipe by eye on the cheat-sheet. |
| **Kid scanned but the atom isn't there** | Check the **Seer's tally**. If it's not there in ~2 sec it didn't land — **just re-scan the same card** (safe). Far/contested card → **staff-inject** that atom. |
| **Card won't scan** | Clean the lens, hold steady ~15 cm, add light. Still no → **staff-inject** it or swap in a **spare card**. |
| **A card is missing / taken** | **Staff-inject** the element, or replace from spares and re-tape. |
| **Team can't find the last atom** | Read the **tally** to see exactly what's short → send kids for that colour, or **inject** it. |
| **Team "stuck" — tray full but won't seal** | They have wrong/**gold-trap** cards. Read the tally, **inject the missing piece** to make it ready (prefer inject over reset), then Seer clicks the glowing **⟡ אשרו את הקשר**. |
| **A team got Reset by accident** | Don't re-hunt everything. On `?staff`, **inject** the atoms for each already-finished molecule + Seer **Confirm Bond** to fast-advance back to where they were. |
| **No audio on a phone** | Tap the screen once. Check the **◉ קול / ◌ מושתק** toggle (◌ = muted). Check **volume up + silent switch off**. |
| **Wrong team / zero progress while teammates have atoms** | That station is in the wrong room — **re-join with the team button / badge link** (not the custom field). Real state reappears instantly. |
| **Dead phone / battery** | Swap to a **spare** charged phone → open the team's badge link → it rejoins with full progress. |
| **TV video won't play / no sound** | Play from the **USB/laptop backup**; check HDMI source + volume. If all fails, **Yon narrates the intro live** as ראש-המסדר. |
| **A kid is melting down** | Stay calm, lower your voice, **don't power-struggle**. Offer a small choice/role or a quiet break. **Ops helper backs up** the guide (two adults). |
| **A kid leaves the area** | One adult follows **calmly** (no chasing/cornering), redirects with a job ("you're our scout"). |
| **A team is falling far behind** | It's **cooperative, not a race**. Quietly **inject** to keep them moving; talk up their gifts. The finale celebrates everyone. |

---

## Full risk list by domain

### 1 · Network & backend *(code-grounded)*
- **Captive-portal WiFi** (login page intercepts everything) → connections never
  form; looks like "backend down". **Critical / likely.** Prevent: test on the
  real WiFi with a fresh phone; prefer hotspot. Fix: trigger+accept the portal, or
  switch to hotspot.
- **Uplink/AP drop or saturation** → all teams freeze; no heartbeat means dead
  sockets linger silently. Prevent: tested, powered hotspot. Fix: "recharging"
  pause + WiFi off/on on each phone.
- **Scan lost during a blip** (no offline queue) → atom never appears. Prevent:
  Seer's tray = truth; "wait for the atom to glow in". Fix: re-scan (safe) or
  inject.
- **Stale PWA cache after a deploy** → a phone runs the old build / wrong room.
  Prevent: **freeze deploys**. Fix: close+reopen+two reloads / clear site data.
- **Custom-cell typo → private empty room.** Prevent: badge links only. Fix:
  re-join the real team code.
- **DO cold-start latency** (first scan slow). Prevent: warm all rooms. Fix: wait a
  beat; it's one-time.
- **Accidental Reset = nuclear, irreversible.** Prevent: keep the Seer **kids**
  away from the dashboard reset; never tap OK on "…זה ימחק את כל ההתקדמות". Fix:
  inject + re-seal to catch up.
- **Stuck room (ready never flips).** Prevent: watch the tally; gold = traps. Fix:
  inject the missing element.
- **Worker outage / bad deploy** → all teams down, unfixable live. Prevent: don't
  deploy morning-of; check /health. Fix: manual paper fallback.
- **Seer laptop sleeps/locks** → control drops. Prevent: never-sleep + plugged in.
  Fix: wait for auto-reconnect / refresh + re-join.
- **iOS backgrounding** suspends the socket. Prevent: long auto-lock, no Low-Power,
  home-screen app. Fix: tap+wait, or reopen the badge link.

### 2 · Devices, app & audio
- **Battery death** → charge to 100% + power banks + chargers + power strip; swap
  to a spare (rejoins instantly).
- **Camera permission denied** → app shows "החיישן עיוור": browser site-settings →
  allow camera → reopen; or use the team's other phone; or inject. **Pre-grant on
  every phone beforehand.**
- **Audio silent** → volume up, silent switch off, one tap to unlock, check the
  mute toggle.
- **Badge link wrong/not joining** → test each badge beforehand; fix via the
  team button.
- **Kid hits back/refresh/closes app** → reopen badge link, state intact.
- **Too few devices** → fall back to one shared "campfire" phone per team.
- **RTL/zoom/rotation glitch** → lock portrait; refresh.

### 3 · Scanning, atom-supply & gameplay
- **QR won't scan** (glare/dark/crumpled/dirty lens) → light + clean lens + steady;
  else inject/spare. Print matte, big, light the rooms.
- **Atom shortage** (esp. glucose 6C/12H/6O) → kit is sized for it; **spread C/O/H
  widely**, don't cluster. Fix: inject.
- **Cards pocketed/moved** → **tape in place**, brief "scan, don't take"; inject to
  cover gaps.
- **Glucose too hard / demoralizing** → it's a **bonus "champions" build**, nobody
  must finish; a guide reframes "even halfway is legendary," or inject to keep
  momentum, or move on.
- **Gold traps confuse kids** → brief they're fun dead-ends; the toast reassures.
- **Two teams want the same card** → both can scan it in place (per-team tracking),
  so no real conflict — remind them.
- **Seer can't seal / seals confusion** → the seal only lights when truly ready
  (can't seal early); the guide sits with the Seer and points to the glowing
  button.

### 4 · Physical, logistics, TV & timing
- **Opening video fails** → test on the real TV beforehand (HDMI/cast, MP4, volume,
  bring a speaker); USB + laptop + cloud copies; else Yon narrates live.
- **Ceremony (?manage) gaps** (clips/roster) → load + test beforehand; skip a
  missing clip and call the name live (it's staff-paced).
- **Printing/cutting not done** → do it the night before; **reprint the 68-card
  sheet** (it grew with glucose).
- **Tape fails / cards fall** → strong tape, tucked not dangling; spares; inject.
- **Room locked** → confirm access/keys the day before; fall back to fewer rooms.
- **Pacing** — racing ahead → push them to glucose / a "find all 6 trap cards"
  side-quest; too slow → guides help, skip glucose, celebrate where they are.
- **Lost badges/wands** → any team badge works for that team; wands are cosmetic.
- **Running in the corridor** → brief "fast walking"; clear hazards; cards at safe
  heights; guides manage pace.

### 5 · Audience & behaviour (EBD / anxiety / ADHD / ODD)
- **Meltdown/shutdown/refusal** → calm, quiet voice, no power-struggle, offer a
  choice/role or break; two adults (ops backs up the guide).
- **Frustration when stuck** → app never says "wrong"; give a direct hint or
  inject; celebrate the next find loudly.
- **A kid finds nothing** → give a **role** (scanner/finder/runner) and walk them
  to an easy guaranteed win ("look low by that chair").
- **Competition stress / behind** → **cooperative not a race**, no scoreboard;
  inject to keep a lagging team moving; the finale celebrates all.
- **Conflict/aggression** → separate gently, give each a job, don't hunt for
  "fault".
- **Phone thrown/damaged** → swap to a spare, don't make it a confrontation; cases
  if possible.
- **Over-stimulation/noise** → per-device scan audio already reduces it; mute
  extras; use a "recharging" pause to reset energy.
- **Quiet kid excluded** → roles ensure a turn; hand them the phone / a find.

### 6 · Staff & operations / recovery
- **Roles:** 3 Order guides (one per team) + 1 ops/tech (with Yon, holds the
  `?staff` phone) + Yon (GM / voice). Ops **floats** to back up any meltdown.
- **A helper who doesn't get it** → the Hebrew helper guide + a 10-min walkthrough
  before kids; ops handles tech, guides handle kids.
- **Seer kid can't run the dashboard** → the **adult guide drives the dashboard**;
  the kid relays hints.
- **Yon pulled away** → the app **narrates from recordings** without him; ops can
  run `?manage` and `?staff`.
- **Nobody knows the tools** → this runbook + the quick card; ops is the trained
  `?staff`/reset person (and "never reset" rule).
- **Comms across rooms** → a group chat / walkie / a runner.
- **Total tech death** → the printed recipe cheat-sheet → run it as a paper hunt.
