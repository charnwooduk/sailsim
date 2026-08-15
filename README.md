# Marina Docking Simulator

A close-quarters boat-handling practice sim for single-screw sailing yachts from 27 to 44 feet.
Top-down chart view, no diesel, no gelcoat.

**To run it:** double-click `ssim.html`. That's it — no install, no build step, no server, no
internet. One self-contained file.

**To check the physics:** open `ssim.html?selftest=1`. It runs eighteen behavioural test cases
headlessly and prints a pass/fail table with actual-versus-expected numbers.

**On a phone or an iPad:** it starts itself in touchscreen mode — see [Touchscreen
mode](#touchscreen-mode) below. Nothing to install there either; open the file and it rearranges
itself around a dock of real controls.

Also useful: `?drill=3` jumps straight to a drill, `?zoom=9` sets the initial scale,
`?touch=1` / `?touch=0` forces touchscreen mode on or off.

---

## The five boats

All real production yachts, all with published dimensions. Pick one from the panel top right;
changing boat restarts the drill, since her dimensions, cleats and hull outline are all different.

| Boat | | Displ. | Keel / rudder | Drivetrain |
|---|---|---|---|---|
| **Catalina 27** | 1971–91 | 3.1 t | fin, spade | shaft + 2-blade |
| **Contessa 32** | 1971– | 4.3 t | long fin, skeg-hung | shaft + 3-blade or 2-blade |
| **Hallberg-Rassy 34** | 1990–98 | 6.2 t | fin, skeg-hung | shaft + 3-blade |
| **Beneteau First 40.1** | 1986–90 | 8.2 t | deep fin, spade | shaft + 3-blade, or saildrive |
| **Jeanneau Sun Odyssey 44i** | 2008–12 | 9.8 t | fin, spade | saildrive folding, or shaft |

Only the First 40.1 and the Sun Odyssey can have thrusters. On the Catalina, the Contessa and the
Hallberg-Rassy the buttons grey out, because none of the three was built with a tunnel.

### How differently they actually handle

| | top | coast to 1 kn | walk astern | steerage at 2 kn astern | wind vs astern thrust |
|---|---|---|---|---|---|
| Catalina 27 | 5.9 kn | 21 m | 11° | 25° | 0.72 |
| Contessa 32 | 6.0 kn | 22 m | 12° | 21° | 0.60 |
| Hallberg-Rassy 34 | 6.9 kn | 25 m | 13° | 17° | **0.47** ← most forgiving |
| First 40.1 | 7.2 kn | 28 m | 10° | 17° | 0.55 |
| Sun Odyssey 44i | 7.0 kn | 35 m | **2°** | 16° | **0.96** ← hardest |

That last column is the one that decides how a berthing actually feels: it's the sideways wind force
in 18 knots as a fraction of the astern thrust she has to fight it with. At **0.96 the Sun Odyssey
cannot back against 18 knots at all** — and she has 27 cm of clearance each side in a finger berth
against the Catalina's 106 cm. The Hallberg-Rassy is the opposite: heavy, so she takes 25 m to lose
her way, but a big three-blade that walks decisively and a skeg that holds her straight.

The Catalina is the one that surprises people. She has the *most* windage per tonne of any boat here,
so she blows about worse than the 44-footer does, and she carries so little way that she stops before
you have finished the manoeuvre.

### How the four new boats were derived

Their principal dimensions are published figures. Everything else — mass, added mass, inertia, the
five underwater panels, drag calibrated to each boat's own hull speed, windage, cleats, fenders,
thrust — is **derived from the First 40.1 by scaling law**, because she is the boat the seventeen
acceptance tests were tuned against.

Every derived quantity is written as `anchorValue × ratio`, where the ratio is exactly 1.0 when fed
the 40.1's own figures. So she comes out bit-for-bit unchanged — all seventeen of her tests still
pass untouched — and the other four are displaced from a known-good point rather than invented. Test
**T17** then checks the whole fleet: every boat must make 82–98% of her theoretical hull speed, walk
her stern to port, answer the helm at 2 kn astern, make sensible leeway, and turn in a plausible
number of her own lengths.

Hand-authoring five boats fully would have meant inventing about two hundred coefficients with no way
to check most of them.

---

## The three things this exists to get right

1. **Reversing drags to one side.** A right-handed propeller walks the stern to port in astern gear.
   It is at full strength the instant you engage from rest, is **down to about half by 2 kn of
   sternway and a third by 3 kn**, and also decays over the first few seconds as axial flow
   establishes — which is why sailors talk about *bursts*: three short kicks walk her further than
   one long pull. A full astern burst from rest swings her about 10°, uncorrectably.
2. **The rudder has almost no authority at low speed, and none at all in reverse *until you have
   sternway*.** A rudder is a foil and needs flow over it. In ahead gear the propeller throws a jet
   straight over the blade, so you can kick her round without moving — that jet is gated on
   `gear > 0` structurally, not fudged, so in astern gear it contributes exactly nothing.

   But going astern the blade still has the water she is moving through, and once she is making a
   couple of knots backwards that is real flow and she answers the helm. So reverse has two
   distinct phases, and both matter:

   | Sternway | Helm hard a-starboard, 6 s | What you feel |
   |---|---|---|
   | 1.0 kn | 0.2° — nothing | walk and helm cancel; the wheel is useless |
   | 1.5 kn | 8° | she starts to answer |
   | 2.0 kn | 17° | answering clearly |
   | 3.0 kn | 29° | steers properly |
   | 4.0 kn | 40° | full steerage astern |

   Those are net figures with prop walk live and fighting the helm, which is what the helmsman
   actually experiences. The hand-over happens because the walk *fades with speed* while the rudder
   *grows with speed* — see point 1. And remember the other half of it: **going astern the stern
   follows the wheel.**
3. **Wind and tide are first-class.** Her windage is 29 m², a third of it rig, and the centre of it
   is 1.13 m forward of the keel's centre of lateral resistance — so the bow blows off, every time.
   A uniform tidal stream, meanwhile, exerts **no force at all** on a boat drifting with it, and the
   full five and a half kilonewtons on a boat tied up in it.

---

## Controls

| Key | |
|---|---|
| `←` `→` or `A` `D` | helm to port / starboard |
| `X` | centre the helm |
| `↑` `↓` or `W` `S` | engine lever ahead / astern |
| `Space` | slam into neutral |
| `Q` `E` | bow thruster to port / starboard |
| `,` `.` | stern thruster to port / starboard |
| `Z` `C` | select the bow / spring / stern line |
| `G` | throw the selected line to the nearest bollard in range |
| click a bollard | throw the selected line to that one |
| `0`–`9` | throw to a bollard by number (see below) |
| `Enter` | make the line fast (once fast, you can winch it in) |
| `M` | **make fast alongside** — rig all three lines at once and tend them snug |
| `[` `]` | pay out / haul in |
| `Backspace` | slip the line |
| `F` `T` | force arrows / track trail |
| `P` / hold `Shift` | pause / quarter speed |
| `R` | reset the drill |
| `H` | full key list |

The wheel and the engine lever bottom-left can be dragged with the mouse. Scroll to zoom, drag the
chart to pan, double-click to go back to following the boat.

### Touchscreen mode

A phone or a tablet has no keys to hold down and no room for four corner panels at once, so
`body.touch` rearranges the page: a slim band of numbers across the top, a dock of controls across
the bottom, and the reference panels tucked into sheets that slide over the chart only while you
are reading them. It turns itself on when the primary pointer is a fingertip
(`pointer: coarse`), and there's a **Touchscreen mode** button under ☰ → Controls to force it
either way — useful for trying the dock with a mouse, or turning it off on a tablet with a keyboard
attached. The choice is remembered; `?touch=1` and `?touch=0` override it.

The dock drives exactly the same code the keyboard does — its held buttons write into the same key
table, its one-shot buttons call the same actions — so the two can't drift apart.

| On the dock | |
|---|---|
| wheel, engine lever | drag them with a thumb; both are drawn larger than on desktop |
| `◀` `▶` beside **bow** / **stern** | the thrusters. Held, not toggled: they run only while pressed, and grey out on a boat with no tunnel or one that has tripped |
| the line name (`bow`) | tap to change which line you are handling |
| **throw** | to the nearest bollard in range — the same as `G` |
| **make fast** / **pay** / **haul** / **slip** | as `Enter`, `[`, `]`, `Backspace`. Slip moves into the ⚓ sheet on a narrow phone |
| **all fast** | `M` — bow, spring and stern together on the face she is lying against |
| **N** `✛` `❚❚` `↺` | neutral, centre the helm, pause, reset the drill |

| On the chart | |
|---|---|
| tap a bollard | throw the selected line to it. The tap target is nearly twice the mouse one, and a press that wanders more than a few pixels is treated as a pan, so panning from a bollard never throws by accident |
| drag | pan |
| pinch | zoom |
| double-tap the water | go back to following the boat |

☰ opens the drill, the weather and the boat; ⚓ opens the mooring lines and their controls; the
numbers along the top open wind and tide. Tapping the help card or the debrief dismisses it, since
there is no `Esc`.

The layout adapts to the room it has. On a phone the readouts lift out onto a band of their own
above the dials — there is no width for wheel, lever, numbers and eight buttons in one row — and
rotating the phone moves them back. Landscape phones shrink everything and drop the thruster heat
bars. Tablets get a noticeably bigger wheel. Safe-area insets are respected, so nothing hides under
a notch or a home indicator.

### Picking a bollard out of forty-seven

The marina has 47 numbered bollards, so no single keypress can name one. Three ways to throw:

- **`G`** — throws to whichever bollard is nearest and in reach. This is what you'd actually do on a
  boat, where you throw to what you can reach and never to a number. Usually all you need.
- **Click the bollard** on the chart — or tap it, on a touchscreen. Unambiguous, and the ones within
  range are highlighted orange.
- **Type the number.** Digits accumulate and the throw goes the moment the number can only mean one
  bollard — `21` can only be 21, so it goes at once. Only **1, 2, 3 and 4** wait a moment, because
  they might yet become 10–19, 20–29, 30–39 or 40–47. `Esc` cancels a half-typed number.

The panel bottom right always shows the nearest bollard in range and its distance.

### `M` — make fast alongside

Throwing lines one at a time skews her, and that's not a bug: a line takes up at exactly the length
it happened to land at, so the first one you get ashore becomes a pivot and she swings about it.

`M` rigs **all three at once** — bow, midship spring and stern — to the best bollards on the face
she's lying against, each starting at its current length so nothing snatches. It then **tends them
up snug** (450 N) for 90 seconds, using the same tension-limited winching as `[` and `]`.

It refuses, and says why, if she's doing more than 1.2 kn, lying more than 32° across, or has nothing
alongside. And it is not a magic docking button — it only ever pulls on ropes:

| | |
|---|---|
| **Calm water, 14° askew** | comes square: 14° → 9° → 6° → **under 2°** over about 90 s |
| **15 kn blowing her off the wall** | settles around 23° and stays there |

That second row is the honest one. The winches cannot beat the weather, so she ends up wherever the
lines and the wind agree — which is exactly why you get a line ashore *early* rather than tidying up
afterwards. Touching `[` or `]` yourself cancels the tending on that line.

### What the force overlay is showing you

`F` draws the live forces on the boat. Each arrow starts where the force actually acts and its length
is proportional to how hard it is pushing:

| | |
|---|---|
| **green**, along her centreline | propeller thrust, drawn at the propeller |
| **red**, sideways at the stern | **prop walk** — appears the instant you engage astern, pointing to port |
| **violet**, sideways at the rudder | the propeller jet across the blade. Vanishes completely in astern gear |
| **pale violet**, sideways at the rudder | the rudder's own lift from the water she is moving through |
| **cyan** | bow or stern thruster |
| **yellow**, near the mast | total wind force, drawn at the centre of effort |
| **yellow crosshair** on her centreline | the **pivot point** |

The pivot point is the one worth understanding. It marks the single point on the boat with no sideways
motion — the point she is turning about at that instant. Everything forward of it swings one way,
everything aft of it swings the other, and the further from it a point is, the faster that end sweeps.

It **moves**, and that explains the two things that catch people out:

- **Making way ahead** it sits roughly a third back from the bow, so your **stern swings wide** — which
  is how you put your quarter into the boat behind while pulling out of a berth.
- **Going astern** it moves aft, close to the stern, so it is your **bow** that scythes across the
  fairway instead.

Nothing in the physics reads it; it is derived from her motion purely to be displayed. It hides when
she is barely turning, or when it runs off past her ends where it stops meaning anything. There's a
numeric readout of it in the Wind & Tide panel too.

### The yellow dots along her sides

Those are her fenders — four stations a side, and they are functional rather than decoration. A touch
that lands within 1.30 m of one uses a soft contact (250 kN/m, friction 0.45); a touch on bare hull is
**8.8× stiffer** (2200 kN/m, friction 0.25) and scores **2.5× the damage**. Hitting a neighbour costs
another 1.6×.

You cannot move them — she is rigged fore and aft on both sides, as you would be for a marina. What
matters is that **her ends are bare**:

| Boat | bare bow | bare stern |
|---|---|---|
| Catalina 27 | 0.95 m | 0.61 m |
| Contessa 32 | 1.38 m | 0.98 m |
| Hallberg-Rassy 34 | 1.56 m | 1.13 m |
| First 40.1 | 2.05 m | 1.55 m |
| Sun Odyssey 44i | 2.40 m | 1.85 m |

Which is exactly where you tend to hit things — the stem going in, a quarter coming out. The debrief
reports "bare hull touched" separately from the energy, because they are different mistakes.

### Reading the boat without looking away from her

In close quarters your eyes are on the bow and the pontoon, not down in the corner, so the two things
you need most often are repeated right next to the boat:

- **Rudder angle** — a horizontal strip just below her, with `P` and `S` at the ends and the angle
  underneath. It stays screen-aligned like a bulkhead rudder-angle indicator rather than rotating with
  the boat, which would read upside down every time she headed south.
- **Throttle** — a small vertical strip beside it. Up is ahead, down is astern. It is drawn **hollow
  while the gearbox is still taking up** and solid once she is actually in gear, so the engagement
  dead time is visible instead of mysterious — which matters most on the saildrive, where astern takes
  nearly a second to bite.

Both have a **yellow centre mark**, and the wheel has a **yellow king spoke** with a fixed white index
above it, the way a real wheel is whipped or leathered at the centre. Line the yellow up with the
index and the rudder is amidships — no numbers needed.

The helm behaves like a wheel, not a car: it stays where you put it. The lever is a single-lever
Morse control — continuous, with soft detents at astern 3/2/1, neutral, ahead 1/2/3. There is a real
dead time engaging gear, and a longer one if you slam straight from ahead to astern.

---

## The drills

| | Teaches |
|---|---|
| 1. Finger berth, bow in, light airs | The basic approach. How far she carries her way. |
| 2. Finger berth, stern in, cross-tide | Reversing into a berth with the walk fighting your steering. |
| 3. Alongside the hammerhead, blown off | When the wind is taking you off, a line ashore beats more throttle. |
| 4. Med moor, stern to the wall | Backing a long way straight, in a crosswind, with no rudder authority. |
| 5. Turn short round, no thrusters | Back and fill. The walk is a tool, not just a nuisance. |
| 6. The 44-footer, folding prop, breezy | The hardest boat here. Forces a specific boat; the rest use whichever you've selected. |
| 7. Free roam | Everything on sliders. Set your own problem. |

Drill 5 is the one worth dwelling on, and there is a technique to it:

- Helm hard **a-starboard**, short burst **ahead**. The wash across the blade swings the bow to
  starboard while she barely moves.
- Helm hard **a-port**, short burst **astern**. Prop walk swings the stern to port — bow to
  starboard again — and the reversed helm now works *with* the walk instead of against it.

Both phases turn her the same way and the translation roughly cancels, so she comes round inside her
own length. Reversing the helm for the astern kick is worth about 10° per 40 seconds over leaving the
wheel hard over, and it only matters because she has real steerage astern.

To **port** the whole thing is markedly worse — about 66° per 40 s against 101° — because there the
walk fights the astern phase every single cycle. That asymmetry is real, and it is why you plan to
turn, and to berth, the way your propeller wants to.

---

## Tuning guide — every modelled effect and the constant that controls it

All parameters live in section §1 of `ssim.html`. If something doesn't match your boat, this is
where to change it. Run `?selftest=1` afterwards to see what else you moved.

Two levels to it. **`BOAT_DEFS`** holds the five boats' published dimensions plus their keel type,
rudder type, propeller and windage inputs — change those and everything else follows. **`buildBoat()`**
holds the scaling laws, and `REF` holds the validated 40.1 values they are anchored on; changing
anything in `REF` moves all five boats at once. The constants below live in `REF` or are shared.

### Prop walk
| Constant | Does what |
|---|---|
| `DRIVES.shaft.k_pw_astern` | **The whole effect.** Fraction of astern thrust that comes out sideways. Raise for more walk. |
| `DRIVES.shaft.k_pw_ahead` | Mild kick of the stern to starboard going ahead. Keep this small — see the warning below. |
| `ENGINE.u_ref_pw` | **Speed at which the walk has halved — 1.10 m/s, about 2.1 kn.** This is what makes the walk a low-speed effect and lets the rudder take over as she gathers sternway. Raise it and the walk keeps full strength at all speeds, cancels the rudder, and reverse becomes uncontrollable everywhere rather than just at the start. |
| `ENGINE.attDepth`, `ENGINE.tau_att` | How much the walk dies as axial flow establishes, and how quickly. This is what makes bursts better than one long pull. |

**Warning worth knowing:** `k_pw_ahead` fights the propeller wash over the rudder, because ahead
walk pushes the stern to starboard while starboard helm pushes it to port. Set it too high and you
quietly destroy the most useful trick in close quarters. It belongs around a tenth of the astern
value.

### Rudder
| Constant | Does what |
|---|---|
| `DRIVES.*.k_wash` | How much of the propeller jet the blade catches. This is the "kick her round on a burst ahead" effect. The shaft boat gets 0.35, the saildrive 0.15, because its leg sits 1.9 m further forward. |
| `WASH_DEFL` | How much of the jet a given rudder angle deflects. Peaks at 35° — a blade in a race stalls late. |
| `PANELS` P5 `fRev` | How much lift the blade still makes with the water coming at it backwards — **this constant is your steerage astern.** 0.95. |
| `PANELS` P5 `A` | Blade area, 1.10 m². A deep modern spade on a 12 m performance cruiser. |
| `HELM.wakeAhead` | Wake deficit at the blade **going ahead only**, 0.20. Ahead the rudder sits in the hull's boundary layer and sees ~80% of her speed through the water, and force goes as the square of that; going astern it leads and takes clean water off the open sea. This is the right way to set the ahead/astern asymmetry — raise it to soften her turn under power without touching reverse. |
| `HULL.N_rr` | Quadratic yaw damping on top of the panels, 200000. Sets the turning circle under power. Being quadratic, it bites on a fast turn and is nearly absent at prop-walk yaw rates. |
| `FOIL.rudder` | Full lift/drag curve. Peak at 21°, then it falls away: past that, more helm turns her *worse* and slows her down. |
| `HELM.maxRate`, `HELM.tau` | How fast you can spin the wheel, and how much it lags. |

`fRev` deserves a note, because getting it wrong is how you end up with a boat that cannot be
reversed at all. It was briefly set to 0.30, to stop the rudder's counter-moment cancelling the prop
walk during a burst from rest. That worked, but it also deleted the astern steering — and at 2 kn of
sternway the rudder and the walk then balanced almost exactly, so she carried straight on regardless
of the wheel. Prop walk has its own speed fade (`ENGINE.u_ref_pw`); use that to control the walk, and
leave `fRev` to control the steerage. They are separate effects and want separate knobs.

Under power she turns at **9.2°/s in 1.95 boat lengths** with the helm hard over from 5.1 kn, losing
about a knot and a half in the turn and carrying 9° of drift angle with the bow inside the track.
Twenty degrees of helm opens that out to 3.2 lengths. If you want her lazier, raise `HELM.wakeAhead`
or `HULL.N_rr`; the first only affects going ahead, the second affects fast turns both ways.

### Hull and how far she carries her way
| Constant | Does what |
|---|---|
| `HULL.X_u` | **How long she carries her way.** The main gameplay knob. Raise to 280 to shorten the glide about 20%, drop to 120 to lengthen it about 30%. |
| `HULL.X_uu`, `X_res` | Friction/form and wave-making drag. These set top speed. |
| `HULL.N_r` | Small linear yaw damping. **Keep it small.** At the design value of 25000 it silently became the dominant yaw term and crushed prop walk and wash steering to a fifth of their proper authority. |
| `BOAT.I_z` | Yaw inertia. Raise it and she feels like a barge; the design figure of 128000 was high enough that no plausible prop-walk force could shift her. |
| `BOAT.m_y` | Sway added mass. 17.6 t of effective mass is why she is so reluctant to start, or stop, moving sideways. |
| `PANELS` | The five underwater panels. Anisotropic drag, yaw damping, directional stability ahead, instability astern, keel lift, the migrating pivot point and current-shear yaw moments all emerge from these. None of them is separately tuned. |

### Wind
| Constant | Does what |
|---|---|
| `WIND_PANELS` | Three windage panels. Their weighted centre lands 0.93 m forward of the CoG, against a hydrodynamic centre at −0.20 m. **That 1.13 m gap is the couple that blows your bow off.** If you ever "fix" a handling complaint by moving these together, you have broken the boat. |
| `WINDAGE.Cy`, `Cx` | Lateral and frontal force coefficients. `Cy` sets the leeway rate. |
| `WINDAGE.gust`, `veer` | Two Ornstein–Uhlenbeck processes: one on speed, one on direction. The direction one is what makes her sail about on her lines. |
| `WORLD.shelterZones` | Wind shadow. Sampled per panel, so with the bow behind a shed and the stern in clear air you get a real yaw moment shoving your stern out. |

### Tide
| Constant | Does what |
|---|---|
| `WORLD.currentZones` | Authored zones, baked to a blurred grid at load so the boat never crosses a velocity step. `f` is strength relative to the slider, `dir` is the bearing the water flows towards on the flood. |
| The breakwater eddy | The most valuable feature in the field: the stream reverses just inside the entrance, so your bow reaches slack water while your stern is still in the tide. That shear is exactly the moment a marina entrance bites you. |

### Lines, thrusters, contact
| Constant | Does what |
|---|---|
| `LINE.EA`, `zeta` | Rope stiffness and damping. Nylon really is stretchy — that is the shock absorber it is designed to be, and it is also what keeps this numerically calm. |
| `LINE.rangeMax` | How far you can throw. 9 m is a good throw; beyond that you are kidding yourself. |
| `LINE.handHaul`, `winchHaul`, `handHold` | 900 N is one person braced on a wet line; 2500 N is the same line led to a sheet winch. Above 700 N an unmade line slips through your hands, which is forgiving and is also how you *should* take up a line on a moving boat. |
| `THRUSTERS.u_fade` | Why a bow thruster is nearly useless above 2 kn. |
| `THRUSTERS.T_run` | Trips after about two and a half minutes of continuous use, so it can't be an infinite crutch. |
| `FENDERS` | The four fender stations, both sides. Reach is 1.30 m either side of each, so her ends are bare — see below. |
| `CONTACT.bareMul` | How much worse a bare-hull knock scores than the same one on a fender: 2.5×. `neighbourMul` adds 1.6× for hitting somebody else's boat. |

---

## Honest notes on what I'm unsure about

Two behaviours where the physics and the design brief disagreed, and I went with the physics. These
are the two I'd most like your judgement on.

**1. How far she swings on a full astern burst.** The brief asked for 22–28° in five seconds.
Reaching that needs a transverse force around 45% of thrust, which is far outside anything published
for prop walk (5–20% steady-state is the usual range; a burst from a standstill with the blades
heavily loaded is arguably higher). At `k_pw_astern` 0.45 — about 29% of thrust once the axial flow
has established — she swings about **10°**. Three things each fight the walk
and all three are real: her yaw inertia, the resistance of shoving 17.6 tonnes of effective mass
sideways, and the rudder acting as a fin even reversed. 10° of *uncorrectable* swing per burst is
still a lot in a marina — reversing 20 m into a berth leaves you well off line. But if it feels weak
against the real boat, raise `DRIVES.shaft.k_pw_astern`; that constant is the whole effect.

**2. What she does when you leave her alone in a breeze.** Beam-on in 15 kn she goes sideways at
0.87 kn, which matches the brief. But left alone she then falls off downwind, gathers way, and sails
off at about 1.7 kn under bare poles rather than lying beam-on indefinitely. That is what the force
balance genuinely produces for a modern fin keeler with the rig forward, and it is what such boats
actually do — you cannot have both "the bow blows off" and "she lies beam-on stably", because they
are the same couple with opposite signs. Both behaviours are tested (T9 and T9b).

Two smaller places where the brief's own arithmetic didn't hold up, now corrected in code and noted
in the tests: the "ahead 2" speed row forgot to apply its own thrust-falloff term (5.3 kn, not 6.0),
and the thruster trip time didn't match its own thermal equation.

**3. A prop-walk figure that moved.** A full astern burst from rest now swings her about 10°, down
from 12° when astern rudder authority was restored — because a blade that bites going backwards also
damps her swing, which is correct. `k_pw_astern` was raised from 0.40 to 0.45 to claw most of it back.
The two are coupled, so if you retune one, check the other.

---

## Layout of `ssim.html`

| § | |
|---|---|
| 0 | Units and maths helpers |
| 1 | **All boat parameters** — every tuning knob is here |
| 2 | The marina, as plain data |
| 3 | Tidal stream field |
| 4 | Wind: gusts, veer, shelter |
| 5 | **Forces** — the one place the tide enters the physics |
| 6 | Mooring lines |
| 7 | Contact, fenders, the bottom |
| 8 | Integrator: semi-implicit Euler at 120 Hz |
| 9 | Camera |
| 10 | Boat state and the drills |
| 11 | The behavioural acceptance suite |
| 12–15 | Render, input, touchscreen mode, HUD, main loop |

Physics is written as pure functions of state, so the numbers stay findable.
