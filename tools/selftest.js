/* Runs the simulator's own acceptance suite in a headless browser and fails the
   build on a red case.

   The suite itself lives in ssim.html §11 and is the real authority on whether
   the boat still behaves like a boat — this file only presses the button and
   reads the answer, so there is no second copy of the expectations to keep in
   step. Open ssim.html?selftest in any browser to see the same table.

   It also loads the page normally afterwards, because a suite that passes in a
   file which throws on boot is worth nothing: §11 runs before any of the
   rendering or the interface does.

   Usage: node tools/selftest.js */
"use strict";

const path = require("path");
const { chromium } = require("playwright");

const PAGE = "file://" + path.resolve(__dirname, "..", "ssim.html");

(async () => {
  const browser = await chromium.launch();
  let bad = 0;

  /* ---- the acceptance suite ---------------------------------------- */
  {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto(PAGE + "?selftest");
    try {
      await page.waitForSelector("#selftest table", { timeout: 20000 });
    } catch (_) {
      // Almost always a script that failed to parse or threw on the way in, in
      // which case the browser's own message is the useful thing to print — not
      // a bare timeout on a table that was never going to appear.
      console.error("the suite never rendered its table.");
      if (errors.length) console.error("the page reported:\n  " + errors.join("\n  "));
      else console.error("the page reported no error, so look for a hang rather than a throw.");
      process.exit(1);
    }

    const result = await page.evaluate(() => {
      const rows = [...document.querySelectorAll("#selftest h2")].map((h) => ({
        ok: h.textContent.trim().startsWith("PASS"),
        name: h.textContent.replace(/^(PASS|FAIL)\s*/, "").trim(),
      }));
      return { rows, headline: document.querySelector("#selftest b").textContent.trim() };
    });

    for (const r of result.rows) console.log(`${r.ok ? "  ok  " : "  FAIL"}  ${r.name}`);
    console.log(`\n${result.headline}`);

    // A suite that ran no cases at all has not passed, it has not run.
    if (result.rows.length === 0) { console.error("\nno test cases ran at all"); bad++; }
    if (result.rows.some((r) => !r.ok)) bad++;
    if (errors.length) { console.error("\nerrors on the selftest page:\n" + errors.join("\n")); bad++; }
    await page.close();
  }

  /* ---- and the page it is testing, actually booting ------------------ */
  for (const [label, opts] of [
    ["desktop", { viewport: { width: 1440, height: 900 } }],
    ["touch",   { viewport: { width: 390, height: 780 }, hasTouch: true, isMobile: true }],
  ]) {
    const ctx = await browser.newContext(opts);
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto(PAGE + (label === "touch" ? "?touch=1" : "?touch=0"));
    await page.waitForTimeout(1200);          // let a few frames actually render

    const state = await page.evaluate(() => ({
      booted: typeof boat !== "undefined" && Number.isFinite(boat.X),
      touch: touchMode,
      // Chrome that runs off the side of the screen is a broken layout.
      overflows: document.documentElement.scrollWidth > window.innerWidth + 1,
    }));

    const wantTouch = label === "touch";
    const ok = state.booted && state.touch === wantTouch && !state.overflows && !errors.length;
    console.log(`  ${ok ? "ok  " : "FAIL"}  ${label} page boots ` +
                `(booted ${state.booted}, touch ${state.touch}, overflows ${state.overflows})`);
    if (!ok) {
      if (errors.length) console.error("    errors:\n    " + errors.join("\n    "));
      bad++;
    }
    await ctx.close();
  }

  await browser.close();
  if (bad) { console.error("\nacceptance run failed"); process.exit(1); }
  console.log("\nall good");
})().catch((e) => { console.error(e); process.exit(1); });
