import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import RootPeriodontiumCard from "../surfaces/cards/RootPeriodontiumCard";
import {
  __getToothStateForTest,
  __resetChartStateForTest,
  __setSelectionForTest,
  __setToothStateForTest,
} from "../odontogram";

beforeEach(() => {
  __resetChartStateForTest();
  __setToothStateForTest(16, { toothSelection: "tooth-base" });
  __setSelectionForTest([16]);
});

describe("endodontic treatment controls", () => {
  it("writes treatment status and type to the active selection", () => {
    render(<RootPeriodontiumCard />);

    fireEvent.change(screen.getByLabelText("Treatment status"), { target: { value: "in-progress" } });
    fireEvent.change(screen.getByLabelText("Treatment type"), { target: { value: "retreatment" } });

    expect(__getToothStateForTest(16)?.endodonticTreatment).toMatchObject({
      treatmentStatus: "in-progress",
      treatmentType: "retreatment",
    });
  });

  it("records session dates and complete canal measurements from the form", () => {
    render(<RootPeriodontiumCard />);

    fireEvent.change(screen.getByLabelText("Session date"), { target: { value: "2026-11-06" } });
    fireEvent.click(screen.getByRole("button", { name: "Add session" }));

    fireEvent.change(screen.getByLabelText("Canal"), { target: { value: "MB1" } });
    fireEvent.change(screen.getByLabelText("Root"), { target: { value: "Mesiobuccal" } });
    fireEvent.change(screen.getByLabelText("Working length (mm)"), { target: { value: "20.5" } });
    fireEvent.change(screen.getByLabelText("Reference point"), { target: { value: "MB cusp" } });
    fireEvent.change(screen.getByLabelText("Measurement method"), { target: { value: "apex-locator" } });
    fireEvent.change(screen.getByLabelText("Final file size"), { target: { value: "30" } });
    fireEvent.change(screen.getByLabelText("Taper"), { target: { value: "0.04" } });
    fireEvent.change(screen.getByLabelText("Obturation material"), { target: { value: "gutta-percha" } });
    fireEvent.change(screen.getByLabelText("Canal notes"), { target: { value: "Rechecked" } });
    fireEvent.click(screen.getByRole("button", { name: "Save measurement" }));

    expect(__getToothStateForTest(16)?.endodonticTreatment).toMatchObject({
      sessions: ["2026-11-06"],
      canals: [{
        canalName: "MB1",
        rootName: "Mesiobuccal",
        workingLengthMm: 20.5,
        referencePoint: "MB cusp",
        measurementMethod: "apex-locator",
        finalFileSize: "30",
        taper: "0.04",
        obturationMaterial: "gutta-percha",
        notes: "Rechecked",
      }],
    });
  });
});
