import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", String(process.pid) + "-" + String(Date.now()));
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the locomotive marketplace", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>LocomotiveTrader\.com \| Locomotive Parts Marketplace<\/title>/i);
  assert.match(html, /The dedicated locomotive parts market/i);
  assert.match(html, /View all\s*<!-- -->56<!-- -->\s*demo parts/i);
  assert.match(html, /Manufacturer \/ OEM/i);
  assert.match(html, /Compatible model/i);
  assert.match(html, /All availability/i);
  assert.match(html, /Reference A–Z/i);
  assert.match(html, /EMD D77 DC Traction Motor/i);
  assert.match(html, /NYAB CCB-26 EPCU Module/i);
  assert.doesNotMatch(html, /Request price/i);
});

test("catalog contains 50 additional listings across every category", async () => {
  const inventoryUrl = new URL("../app/inventory.ts", import.meta.url);
  inventoryUrl.searchParams.set("test", String(process.pid) + "-" + String(Date.now()));
  const { listings } = await import(inventoryUrl.href);
  const expectedCategories = [
    "Engines",
    "Engine Components",
    "Traction Motors",
    "Turbochargers",
    "Air & Brake",
    "Electrical",
    "Cooling & Lube",
    "Running Gear",
  ];

  assert.equal(listings.length, 56);
  assert.equal(new Set(listings.map((listing) => listing.id)).size, 56);
  for (const category of expectedCategories) {
    assert.ok(
      listings.some((listing) => listing.category === category),
      "missing category: " + category,
    );
  }
  for (const listing of listings) {
    assert.ok(listing.partNumber);
    assert.ok(listing.manufacturer);
    assert.ok(listing.subcategory);
    assert.ok(listing.engineFamily);
    assert.ok(listing.application);
    assert.ok(listing.availability);
    assert.ok(listing.leadTime);
    assert.ok(listing.models.length > 0);
    assert.ok(listing.keywords.length > 0);
    assert.equal(Object.hasOwn(listing, "price"), false);
  }
});
