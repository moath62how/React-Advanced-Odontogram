import { beforeEach, describe, expect, it } from "vitest";
import {
  __collectExportPayloadForTest,
  __getToothStateForTest,
  __resetChartStateForTest,
  __setSelectionForTest,
  __setToothStateForTest,
  addEndodonticCanalMeasurementForSelection,
  addEndodonticTreatmentSessionForSelection,
  setEndodonticTreatmentForSelection,
} from "../odontogram";
import type { EndodonticCanalMeasurement, EndodonticTreatment } from "../state/endodonticTreatment";

const treatment: EndodonticTreatment = {
  treatmentStatus: "in-progress",
  treatmentType: "initial-root-canal",
  sessions: [],
  canals: [],
  obturationStatus: "not-started",
  finalRestoration: "pending",
  notes: "Working-length verification",
};

const canalMeasurement: EndodonticCanalMeasurement = {
  canalName: "MB1",
  rootName: "mesiobuccal",
  workingLengthMm: 20.5,
  referencePoint: "mesiobuccal cusp",
  measurementMethod: "combined",
  finalFileSize: "30",
  taper: "0.04",
  obturationMaterial: "gutta-percha",
  notes: "",
};

beforeEach(() => {
  __resetChartStateForTest();
  __setToothStateForTest(16, { toothSelection: "tooth-base" });
  __setSelectionForTest([16]);
});

describe("structured endodontic treatment", () => {
  it("adds sessions and upserts canal measurements on the selected tooth", () => {
    setEndodonticTreatmentForSelection(treatment);
    addEndodonticTreatmentSessionForSelection("2026-11-06");
    addEndodonticTreatmentSessionForSelection("2026-11-06");
    addEndodonticCanalMeasurementForSelection(canalMeasurement);
    addEndodonticCanalMeasurementForSelection({ ...canalMeasurement, workingLengthMm: 20.75 });

    const stored = __getToothStateForTest(16)?.endodonticTreatment as EndodonticTreatment;
    expect(stored.sessions).toEqual(["2026-11-06"]);
    expect(stored.canals).toHaveLength(1);
    expect(stored.canals[0].workingLengthMm).toBe(20.75);
    expect(stored.notes).toBe(treatment.notes);
  });

  it("round-trips the treatment record through chart export and import hydration", () => {
    setEndodonticTreatmentForSelection(treatment);
    addEndodonticTreatmentSessionForSelection("2026-11-06");
    addEndodonticCanalMeasurementForSelection(canalMeasurement);

    const payload = __collectExportPayloadForTest();
    expect(payload.teeth[16].endodonticTreatment).toEqual({
      ...treatment,
      sessions: ["2026-11-06"],
      canals: [canalMeasurement],
    });

    __setToothStateForTest(26, payload.teeth[16]);
    expect(__getToothStateForTest(26)?.endodonticTreatment).toEqual(payload.teeth[16].endodonticTreatment);
  });

  it("rejects canal measurements without a named root, canal, and positive working length", () => {
    expect(() => addEndodonticCanalMeasurementForSelection({
      ...canalMeasurement,
      workingLengthMm: 0,
    })).toThrow(TypeError);
    expect(__getToothStateForTest(16)?.endodonticTreatment).toBeNull();
  });

  it("can clear the structured treatment without changing the existing endo diagnosis", () => {
    __setToothStateForTest(16, {
      toothSelection: "tooth-base",
      endo: "endo-filling",
      endodonticTreatment: treatment,
    });
    setEndodonticTreatmentForSelection(null);

    const stored = __getToothStateForTest(16);
    expect(stored?.endo).toBe("endo-filling");
    expect(stored?.endodonticTreatment).toBeNull();
  });
});
