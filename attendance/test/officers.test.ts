import { describe, it, expect } from "vitest";
import { parseOfficers } from "@/lib/officers";

const ADDR_A = "0x99D57F923E31E8518BDF4C665AEE83B9dc582922";
const ADDR_B = "0x1111111111111111111111111111111111111111";

describe("parseOfficers (officers.txt allowlist)", () => {
  it("reads address, role and label", () => {
    const [o] = parseOfficers(`${ADDR_A}  admin  Joey Kokinda`);
    expect(o).toEqual({
      address: ADDR_A.toLowerCase(),
      role: "admin",
      label: "Joey Kokinda",
    });
  });

  it("defaults the role to officer and the label to null", () => {
    const [o] = parseOfficers(ADDR_A);
    expect(o.role).toBe("officer");
    expect(o.label).toBeNull();
  });

  it("treats an unrecognized role as officer, never admin", () => {
    const [o] = parseOfficers(`${ADDR_A} superuser`);
    expect(o.role).toBe("officer");
  });

  it("ignores comments, blank lines and trailing comments", () => {
    const list = parseOfficers(
      ["# header", "", `${ADDR_A} admin Joey # club president`, "   ", ADDR_B].join(
        "\n",
      ),
    );
    expect(list.map((o) => o.address)).toEqual([
      ADDR_A.toLowerCase(),
      ADDR_B.toLowerCase(),
    ]);
    expect(list[0].label).toBe("Joey");
  });

  it("accepts comma-separated columns pasted from a spreadsheet", () => {
    const [o] = parseOfficers(`${ADDR_A},admin,Joey`);
    expect(o.role).toBe("admin");
    expect(o.label).toBe("Joey");
  });

  it("skips lines that are not addresses instead of trusting them", () => {
    expect(parseOfficers("not-a-wallet admin\n0xdeadbeef admin")).toEqual([]);
  });

  it("returns an empty list for an empty file, locking everyone out", () => {
    expect(parseOfficers("")).toEqual([]);
    expect(parseOfficers("# only comments\n")).toEqual([]);
  });
});
