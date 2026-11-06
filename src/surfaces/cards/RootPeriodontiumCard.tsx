// Part of React Advanced Odontogram - https://github.com/ZoliQua/React-Advanced-Odontogram
// Created by Zoltan Dul (https://github.com/ZoliQua) 2025-2026

// Composable-UI Tier 3, PR 3e — the declarative Root / periodontium card BODY.
// Replaces the former imperative `wireControls()` Root/perio block + its
// `syncControlsFromState()` counterpart: it subscribes to engine state
// (`useEngineState(getActiveRootPerio)`) and renders BOTH sub-blocks as
// controlled inputs —
//
//   #rpRootBlock: the merged pulp/endo optgroup select (`#pulpEndoSelect`, whose
//     two `<optgroup>`s + Plan-mode standalone "none" mirror `buildPulpEndoSelect`
//     exactly), structured endodontic treatment/session/canal-measurement
//     controls, the apical-diagnosis / periapical-lesion / root-resorption
//     selects, and the resection + parapulpal-pin checkboxes.
//   #rpPerioBlock: the mobility select, the still-imperative 6-site probing grid
//     (`#perioGrid` + `#perioReadout` — the Tier 3 PR 3e CARVE-OUT, rendered as
//     static empty containers and populated by `buildPerioGrid`/`syncPerioRow`),
//     the inflammation/parodontal mod checkboxes (`#modsChecks`, same ids/markup
//     the removed `buildChecks(MOD_OPTIONS)` emitted), the calculus toggle, and
//     the peri-implant status select.
//
// writing through the `set*ForSelection` setters — which wrap the exact
// `applyToSelected(...)` closures the imperative handlers used (incl. the
// pulp/endo endo↔pulpDx mutual exclusion and the apical→periapical reset), so
// behavior is identical.
//
// ALL row/sub-block visibility, the ordering-dependent mod-checkbox visibility
// (`syncInflammationModVisibility` after `syncPeriImplantVisibility`), the
// dynamic `#lbl-parodontal`/`#lbl-inflammation` label text, and every
// per-control `disabled` flag come pre-resolved from `getActiveRootPerio()`.
//
// The `.card#rootPeriodontiumSection` wrapper, `.card-title`, and
// `#btnToggleRootPeriodontiumCard` collapse toggle stay STATIC in
// `ToothControlsSurface`; this card only owns the body — and it drives the
// section's `hidden` visibility gate (`sectionVisible`) via a layout effect on
// its nearest `#rootPeriodontiumSection` ancestor, since the section element
// itself is static (mirrors `CariesCard`/`FillingsCard`).

import { useLayoutEffect, useRef, type FormEvent } from "react";
import { t } from "../../i18n/useI18n";
import {
  ENDODONTIC_FINAL_RESTORATIONS,
  ENDODONTIC_OBTURATION_STATUSES,
  ENDODONTIC_TREATMENT_STATUSES,
  ENDODONTIC_TREATMENT_TYPES,
  ENDODONTIC_MEASUREMENT_METHODS,
  createDefaultEndodonticTreatment,
} from "../../state/endodonticTreatment";
import {
  getActiveRootPerio,
  setPulpEndoForSelection,
  setEndodonticTreatmentForSelection,
  addEndodonticCanalMeasurementForSelection,
  addEndodonticTreatmentSessionForSelection,
  setApicalDxForSelection,
  setPeriapicalTypeForSelection,
  setResorptionForSelection,
  setEndoResectionForSelection,
  setParapulpalPinForSelection,
  setMobilityForSelection,
  setModForSelection,
  setCalculusForSelection,
  setPeriImplantForSelection,
} from "../../odontogram";
import { useEngineState } from "../useEngineState";

export default function RootPeriodontiumCard() {
  const rp = useEngineState(getActiveRootPerio);
  const rootRef = useRef<HTMLDivElement>(null);
  const treatment = rp.endodonticTreatment ?? createDefaultEndodonticTreatment();
  const treatmentDisabled = rp.activeTooth === null || rp.pulpEndoDisabled;

  const updateTreatment = (patch: Partial<typeof treatment>) => {
    setEndodonticTreatmentForSelection({ ...treatment, ...patch });
  };

  const addSession = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const sessionDate = String(new FormData(form).get("sessionDate") ?? "");
    addEndodonticTreatmentSessionForSelection(sessionDate);
    form.reset();
  };

  const addCanalMeasurement = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const method = ENDODONTIC_MEASUREMENT_METHODS.find((value) => value === data.get("measurementMethod")) ?? "other";
    addEndodonticCanalMeasurementForSelection({
      canalName: String(data.get("canalName") ?? ""),
      rootName: String(data.get("rootName") ?? ""),
      workingLengthMm: Number(data.get("workingLengthMm")),
      referencePoint: String(data.get("referencePoint") ?? ""),
      measurementMethod: method,
      finalFileSize: String(data.get("finalFileSize") ?? ""),
      taper: String(data.get("taper") ?? ""),
      obturationMaterial: String(data.get("obturationMaterial") ?? ""),
      notes: String(data.get("canalNotes") ?? ""),
    });
    form.reset();
  };

  // The #rootPeriodontiumSection visibility gate lived on the section element in
  // the imperative sync; the section stays static (shared collapse infra), so
  // apply its `hidden` class here. Run on EVERY render (no dep array) so a parent
  // re-render that reconciles the section's className back to "card" is
  // immediately re-corrected (mirrors CariesCard/FillingsCard).
  useLayoutEffect(() => {
    const section = rootRef.current?.closest("#rootPeriodontiumSection");
    section?.classList.toggle("hidden", !rp.sectionVisible);
  });

  return (
    <>
      <div id="rpRootBlock" ref={rootRef} className={rp.rootBlockVisible ? undefined : "hidden"}>
        <div className="hint">{t("endo.hint")}</div>
        <div id="pulpEndoRow" className="row">
          <span>{t("pulpEndo.label")}</span>
          <select
            id="pulpEndoSelect"
            value={rp.pulpEndoValue}
            disabled={rp.pulpEndoDisabled}
            onChange={(e) => setPulpEndoForSelection(e.target.value)}
          >
            {rp.pulpEndoNoneOption && (
              <option value={rp.pulpEndoNoneOption.value}>{rp.pulpEndoNoneOption.label}</option>
            )}
            {rp.pulpEndoGroups.map((g) => (
              <optgroup key={g.label} label={g.label}>
                {g.options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <fieldset className="endo-treatment-group" disabled={treatmentDisabled}>
          <legend>{t("endoTreatment.title")}</legend>
          <div className="row">
            <label htmlFor="endodonticTreatmentStatus">{t("endoTreatment.status")}</label>
            <select
              id="endodonticTreatmentStatus"
              value={treatment.treatmentStatus}
              onChange={(event) => {
                const value = ENDODONTIC_TREATMENT_STATUSES.find((candidate) => candidate === event.target.value);
                if (value) updateTreatment({ treatmentStatus: value });
              }}
            >
              {ENDODONTIC_TREATMENT_STATUSES.map((value) => (
                <option key={value} value={value}>{t(`endoTreatment.status.${value}`)}</option>
              ))}
            </select>
          </div>
          <div className="row">
            <label htmlFor="endodonticTreatmentType">{t("endoTreatment.type")}</label>
            <select
              id="endodonticTreatmentType"
              value={treatment.treatmentType}
              onChange={(event) => {
                const value = ENDODONTIC_TREATMENT_TYPES.find((candidate) => candidate === event.target.value);
                if (value) updateTreatment({ treatmentType: value });
              }}
            >
              {ENDODONTIC_TREATMENT_TYPES.map((value) => (
                <option key={value} value={value}>{t(`endoTreatment.type.${value}`)}</option>
              ))}
            </select>
          </div>
          <div className="row">
            <label htmlFor="endodonticObturationStatus">{t("endoTreatment.obturation")}</label>
            <select
              id="endodonticObturationStatus"
              value={treatment.obturationStatus}
              onChange={(event) => {
                const value = ENDODONTIC_OBTURATION_STATUSES.find((candidate) => candidate === event.target.value);
                if (value) updateTreatment({ obturationStatus: value });
              }}
            >
              {ENDODONTIC_OBTURATION_STATUSES.map((value) => (
                <option key={value} value={value}>{t(`endoTreatment.obturation.${value}`)}</option>
              ))}
            </select>
          </div>
          <div className="row">
            <label htmlFor="endodonticFinalRestoration">{t("endoTreatment.finalRestoration")}</label>
            <select
              id="endodonticFinalRestoration"
              value={treatment.finalRestoration}
              onChange={(event) => {
                const value = ENDODONTIC_FINAL_RESTORATIONS.find((candidate) => candidate === event.target.value);
                if (value) updateTreatment({ finalRestoration: value });
              }}
            >
              {ENDODONTIC_FINAL_RESTORATIONS.map((value) => (
                <option key={value} value={value}>{t(`endoTreatment.restoration.${value}`)}</option>
              ))}
            </select>
          </div>
          <label className="endo-treatment-notes">
            <span>{t("endoTreatment.notes")}</span>
            <textarea
              value={treatment.notes}
              rows={2}
              onChange={(event) => updateTreatment({ notes: event.target.value })}
            />
          </label>

          <div className="endo-treatment-subtitle">{t("endoTreatment.sessions")}</div>
          <form className="endo-treatment-entry" onSubmit={addSession}>
            <label>
              <span>{t("endoTreatment.sessionDate")}</span>
              <input name="sessionDate" type="date" required />
            </label>
            <button type="submit" className="btn btn-ghost btn-sm">{t("endoTreatment.addSession")}</button>
          </form>
          {treatment.sessions.length > 0 && (
            <ul className="endo-treatment-list">
              {treatment.sessions.map((session, index) => (
                <li key={`${session}-${index}`}>
                  <span>{session}</span>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    aria-label={t("endoTreatment.removeSession", { date: session })}
                    onClick={() => updateTreatment({ sessions: treatment.sessions.filter((_, i) => i !== index) })}
                  >
                    {t("case.diagnoses.remove")}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="endo-treatment-subtitle">{t("endoTreatment.canalMeasurements")}</div>
          <form className="endo-treatment-entry" onSubmit={addCanalMeasurement}>
            <label>
              <span>{t("endoTreatment.canalName")}</span>
              <input name="canalName" required />
            </label>
            <label>
              <span>{t("endoTreatment.rootName")}</span>
              <input name="rootName" required />
            </label>
            <label>
              <span>{t("endoTreatment.workingLength")}</span>
              <input name="workingLengthMm" type="number" min="0.1" step="0.1" required />
            </label>
            <label>
              <span>{t("endoTreatment.referencePoint")}</span>
              <input name="referencePoint" />
            </label>
            <label>
              <span>{t("endoTreatment.measurementMethod")}</span>
              <select name="measurementMethod" defaultValue="combined">
                {ENDODONTIC_MEASUREMENT_METHODS.map((value) => (
                  <option key={value} value={value}>{t(`endoTreatment.measurement.${value}`)}</option>
                ))}
              </select>
            </label>
            <label>
              <span>{t("endoTreatment.finalFileSize")}</span>
              <input name="finalFileSize" />
            </label>
            <label>
              <span>{t("endoTreatment.taper")}</span>
              <input name="taper" />
            </label>
            <label>
              <span>{t("endoTreatment.obturationMaterial")}</span>
              <input name="obturationMaterial" />
            </label>
            <label>
              <span>{t("endoTreatment.canalNotes")}</span>
              <input name="canalNotes" />
            </label>
            <button type="submit" className="btn btn-ghost btn-sm">{t("endoTreatment.saveMeasurement")}</button>
          </form>
          {treatment.canals.length > 0 && (
            <ul className="endo-treatment-list">
              {treatment.canals.map((canal) => (
                <li key={`${canal.rootName}-${canal.canalName}`}>
                  <span>
                    <strong>{canal.rootName} / {canal.canalName}</strong>
                    {canal.workingLengthMm !== null && ` - ${canal.workingLengthMm} mm`}
                    {canal.measurementMethod && ` (${t(`endoTreatment.measurement.${canal.measurementMethod}`)})`}
                  </span>
                  <details>
                    <summary>{t("endoTreatment.measurementDetails")}</summary>
                    <dl>
                      <dt>{t("endoTreatment.referencePoint")}</dt><dd>{canal.referencePoint || "—"}</dd>
                      <dt>{t("endoTreatment.finalFileSize")}</dt><dd>{canal.finalFileSize || "—"}</dd>
                      <dt>{t("endoTreatment.taper")}</dt><dd>{canal.taper || "—"}</dd>
                      <dt>{t("endoTreatment.obturationMaterial")}</dt><dd>{canal.obturationMaterial || "—"}</dd>
                      <dt>{t("endoTreatment.canalNotes")}</dt><dd>{canal.notes || "—"}</dd>
                    </dl>
                  </details>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    aria-label={t("endoTreatment.removeCanal", { root: canal.rootName, canal: canal.canalName })}
                    onClick={() => updateTreatment({
                      canals: treatment.canals.filter((entry) => entry !== canal),
                    })}
                  >
                    {t("case.diagnoses.remove")}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </fieldset>
        <div id="apicalDxRow" className={rp.apicalDxRowVisible ? "row" : "row hidden"}>
          <span>{t("apical.dxLabel")}</span>
          <select
            id="apicalDxSelect"
            value={rp.apicalDxValue}
            disabled={rp.apicalDxDisabled}
            onChange={(e) => setApicalDxForSelection(e.target.value)}
          >
            {rp.apicalDxOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div id="periapicalTypeRow" className={rp.periapicalRowVisible ? "row" : "row hidden"}>
          <span>{t("periapical.typeLabel")}</span>
          <select
            id="periapicalTypeSelect"
            value={rp.periapicalTypeValue}
            onChange={(e) => setPeriapicalTypeForSelection(e.target.value)}
          >
            {rp.periapicalTypeOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div id="resorptionRow" className={rp.resorptionRowVisible ? "row" : "row hidden"}>
          <span>{t("root.resorption")}</span>
          <select
            id="resorptionSelect"
            value={rp.resorptionValue}
            disabled={rp.resorptionDisabled}
            onChange={(e) => setResorptionForSelection(e.target.value)}
          >
            {rp.resorptionOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="row inline-checks">
          <label style={rp.endoResectionDisabled ? { display: "none" } : undefined}>
            <input
              type="checkbox"
              id="endoResection"
              checked={rp.endoResectionChecked}
              disabled={rp.endoResectionDisabled}
              onChange={(e) => setEndoResectionForSelection(e.target.checked)}
            />
            <span>{t("endo.resection")}</span>
          </label>
          <label style={rp.parapulpalPinDisabled ? { display: "none" } : undefined}>
            <input
              type="checkbox"
              id="parapulpalPin"
              checked={rp.parapulpalPinChecked}
              disabled={rp.parapulpalPinDisabled}
              onChange={(e) => setParapulpalPinForSelection(e.target.checked)}
            />
            <span>{t("endo.parapulpalPin")}</span>
          </label>
        </div>
      </div>

      <div id="rpPerioBlock" className={rp.perioBlockVisible ? undefined : "hidden"}>
        <div id="mobilityRow" className={rp.mobilityRowVisible ? "row" : "row hidden"}>
          <span>{t("inflammation.mobilityLabel")}</span>
          <select
            id="mobilitySelect"
            value={rp.mobilityValue}
            disabled={rp.mobilityDisabled}
            onChange={(e) => setMobilityForSelection(e.target.value)}
          >
            {rp.mobilityOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        {/* The 6-site PD/GM/BOP/SUP probing grid + its derived read-out stay
            IMPERATIVE (Tier 3 PR 3e carve-out): rendered as static empty
            containers here, built by `buildPerioGrid` and synced by
            `syncPerioRow` in the engine — exactly as before. */}
        <div id="perioRow" className={rp.perioRowVisible ? "perio-block" : "perio-block hidden"}>
          <div className="perio-block-title">{t("perio.title")}</div>
          <div id="perioGrid" className="perio-grid"></div>
          <div id="perioReadout" className="hint perio-readout"></div>
        </div>
        <div id="modsChecks" className="check-grid">
          {rp.mods.map((m) => (
            <label
              key={m.value}
              className={m.hiddenClass ? "hidden" : undefined}
              style={m.styleHidden ? { display: "none" } : undefined}
            >
              <input
                type="checkbox"
                id={`chk-${m.value}`}
                value={m.value}
                checked={m.checked}
                disabled={m.disabled}
                onChange={(e) => setModForSelection(m.value, e.target.checked)}
              />
              <span id={`lbl-${m.value}`}>{m.label}</span>
            </label>
          ))}
        </div>
        <div id="calculusRow" className={rp.calculusRowVisible ? "row inline-checks" : "row inline-checks hidden"}>
          <label>
            <input
              type="checkbox"
              id="calculusToggle"
              checked={rp.calculusChecked}
              onChange={(e) => setCalculusForSelection(e.target.checked)}
            />
            <span>{t("calculus.label")}</span>
          </label>
        </div>
        <div id="periImplantRow" className={rp.periImplantRowVisible ? "row" : "row hidden"}>
          <span>{t("periImplant.label")}</span>
          <select
            id="periImplantSelect"
            value={rp.periImplantValue}
            onChange={(e) => setPeriImplantForSelection(e.target.value)}
          >
            {rp.periImplantOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}
