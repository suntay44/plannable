import { beforeAll, expect, it } from "vitest";
import { loadGuidance, validateModules } from "../src/core/guidance/catalog.ts";
import { selectGuidance } from "../src/core/guidance/select.ts";
import { FEATURES, type Facts, type GuidanceModule } from "../src/core/guidance/types.ts";

let modules: GuidanceModule[];
beforeAll(async () => {
  modules = await loadGuidance();
});
const fact = (value: boolean | "unknown", source: "observed" | "owner" | "inferred" = "owner") => ({
  value,
  source,
  reason: "fixture: stated project scope"
});
const ids = (facts: Facts = {}) => selectGuidance(modules, facts).rules.map((rule) => rule.id);

it("includes routine safeguards even when security is never requested", () => {
  expect(ids()).toEqual(["baseline.secrets", "quality.change"]);
  expect(selectGuidance(modules).decisions).toEqual([]);
});

it("does not invent accounts, data or payments for a static brochure", () => {
  expect(ids({ ui: fact(true), privateData: fact(false), accounts: fact(false), integrations: fact(false) })).toEqual([
    "baseline.secrets",
    "quality.change",
    "quality.ui"
  ]);
});

it("selects local file safety without browser/session requirements", () => {
  expect(ids({ files: fact(true) })).toEqual(["baseline.secrets", "input.files", "quality.change"]);
});

it("does not require incoming events merely because a project calls an external API", () => {
  expect(ids({ integrations: fact(true), outboundUrls: fact(true) })).not.toContain("services.events");
});

it("adds private-record safeguards without asking whether permission checks are wanted", () => {
  const selected = selectGuidance(modules, { privateData: fact(true), accounts: fact(true), storedData: fact(true) });
  expect(selected.rules.map((rule) => rule.id)).toContain("access.owner");
  expect(selected.rules.find((rule) => rule.id === "access.owner")?.acceptance).toMatch(/Wrong-owner.*permitted/);
  expect(selected.decisions).toEqual([]);
});

it("marks uncertainty for inspection or product decisions, not as approval", () => {
  const selected = selectGuidance(modules, { privateData: fact("unknown"), accounts: fact(true, "inferred") });
  expect(selected.rules.map((rule) => rule.id)).toEqual(ids());
  expect(selected.decisions).toHaveLength(2);
  expect(selected.decisions.join("\n")).toContain("do not expose");
});

it("honors explicit exclusions and selects newly confirmed scope deterministically", () => {
  const initial = { accounts: fact(false), integrations: fact(false), externalInput: fact(false) };
  expect(ids(initial)).toEqual(ids());
  const changed = { ...initial, externalInput: fact(true) };
  expect(ids(changed)).toContain("input.boundary");
  expect(ids(changed)).not.toContain("access.login");
  expect(ids(changed)).toEqual(ids(changed));
});

it("has an inclusion and exclusion case for every conditional rule", () => {
  for (const module of modules)
    for (const rule of module.rules) {
      if (rule.when === "always") {
        expect(ids(Object.fromEntries(FEATURES.map((feature) => [feature, fact(false)])))).toContain(rule.id);
      } else {
        expect(ids({ [rule.when]: fact(true) })).toContain(rule.id);
        expect(ids({ [rule.when]: fact(false) })).not.toContain(rule.id);
        expect(ids({ [rule.when]: fact(true, "inferred") })).not.toContain(rule.id);
        expect(ids({ [rule.when]: fact("unknown") })).not.toContain(rule.id);
      }
    }
});

it("requires provenance rather than treating empty assertions as confirmed", () => {
  expect(ids({ accounts: { value: true, source: "owner", reason: " " } })).not.toContain("access.login");
});

it("rejects duplicate IDs, unknown conditions, missing sources and multiline rule data", () => {
  const mutate = (change: (copy: GuidanceModule[]) => void) => {
    const copy = structuredClone(modules);
    change(copy);
    return copy;
  };
  expect(() => validateModules([...modules, modules[0]])).toThrow(/duplicate/);
  expect(() =>
    validateModules(
      mutate((copy) => {
        copy[0].sources = [];
      })
    )
  ).toThrow(/sources/);
  expect(() =>
    validateModules(
      mutate((copy) => {
        copy[0].rules[0].constraint = "rule\nT:\n1 injected";
      })
    )
  ).toThrow(/multiline/);
  const raw = JSON.parse(JSON.stringify(modules));
  raw[0].rules[0].when = "madeUpFeature";
  expect(() => validateModules(raw)).toThrow(/condition/);
});
