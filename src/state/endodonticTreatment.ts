export const ENDODONTIC_TREATMENT_STATUSES = [
  "planned",
  "in-progress",
  "completed",
  "interrupted",
] as const;

export const ENDODONTIC_TREATMENT_TYPES = [
  "initial-root-canal",
  "retreatment",
] as const;

export const ENDODONTIC_MEASUREMENT_METHODS = [
  "apex-locator",
  "radiograph",
  "combined",
  "other",
] as const;

export const ENDODONTIC_OBTURATION_STATUSES = [
  "not-started",
  "partially-completed",
  "completed",
] as const;

export const ENDODONTIC_FINAL_RESTORATIONS = [
  "pending",
  "temporary",
  "permanent-filling",
  "crown",
  "other",
] as const;

export type EndodonticTreatmentStatus = typeof ENDODONTIC_TREATMENT_STATUSES[number];
export type EndodonticTreatmentType = typeof ENDODONTIC_TREATMENT_TYPES[number];
export type EndodonticMeasurementMethod = typeof ENDODONTIC_MEASUREMENT_METHODS[number];
export type EndodonticObturationStatus = typeof ENDODONTIC_OBTURATION_STATUSES[number];
export type EndodonticFinalRestoration = typeof ENDODONTIC_FINAL_RESTORATIONS[number];

export type EndodonticCanalMeasurement = {
  canalName: string;
  rootName: string;
  workingLengthMm: number | null;
  referencePoint: string;
  measurementMethod: EndodonticMeasurementMethod;
  finalFileSize: string;
  taper: string;
  obturationMaterial: string;
  notes: string;
};

export type EndodonticTreatment = {
  treatmentStatus: EndodonticTreatmentStatus;
  treatmentType: EndodonticTreatmentType;
  sessions: string[];
  canals: EndodonticCanalMeasurement[];
  obturationStatus: EndodonticObturationStatus;
  finalRestoration: EndodonticFinalRestoration;
  notes: string;
};

export function createDefaultEndodonticTreatment(): EndodonticTreatment {
  return {
    treatmentStatus: "planned",
    treatmentType: "initial-root-canal",
    sessions: [],
    canals: [],
    obturationStatus: "not-started",
    finalRestoration: "pending",
    notes: "",
  };
}

function isOneOf<T extends string>(value: unknown, values: readonly T[]): value is T {
  return typeof value === "string" && values.some((candidate) => candidate === value);
}

function normalizeCanal(value: unknown): EndodonticCanalMeasurement | null {
  if (!value || typeof value !== "object") return null;
  const canal = value as Record<string, unknown>;
  if (typeof canal.canalName !== "string" || typeof canal.rootName !== "string") return null;
  const length = typeof canal.workingLengthMm === "number"
    && Number.isFinite(canal.workingLengthMm)
    && canal.workingLengthMm > 0
    ? canal.workingLengthMm
    : null;
  return {
    canalName: canal.canalName,
    rootName: canal.rootName,
    workingLengthMm: length,
    referencePoint: typeof canal.referencePoint === "string" ? canal.referencePoint : "",
    measurementMethod: isOneOf(canal.measurementMethod, ENDODONTIC_MEASUREMENT_METHODS)
      ? canal.measurementMethod
      : "other",
    finalFileSize: typeof canal.finalFileSize === "string" ? canal.finalFileSize : "",
    taper: typeof canal.taper === "string" ? canal.taper : "",
    obturationMaterial: typeof canal.obturationMaterial === "string" ? canal.obturationMaterial : "",
    notes: typeof canal.notes === "string" ? canal.notes : "",
  };
}

export function normalizeEndodonticTreatment(value: unknown): EndodonticTreatment | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const raw = value as Record<string, unknown>;
  const defaults = createDefaultEndodonticTreatment();
  return {
    treatmentStatus: isOneOf(raw.treatmentStatus, ENDODONTIC_TREATMENT_STATUSES)
      ? raw.treatmentStatus
      : defaults.treatmentStatus,
    treatmentType: isOneOf(raw.treatmentType, ENDODONTIC_TREATMENT_TYPES)
      ? raw.treatmentType
      : defaults.treatmentType,
    sessions: Array.isArray(raw.sessions)
      ? raw.sessions.filter((session): session is string => typeof session === "string")
      : [],
    canals: Array.isArray(raw.canals)
      ? raw.canals.map(normalizeCanal).filter((canal): canal is EndodonticCanalMeasurement => canal !== null)
      : [],
    obturationStatus: isOneOf(raw.obturationStatus, ENDODONTIC_OBTURATION_STATUSES)
      ? raw.obturationStatus
      : defaults.obturationStatus,
    finalRestoration: isOneOf(raw.finalRestoration, ENDODONTIC_FINAL_RESTORATIONS)
      ? raw.finalRestoration
      : defaults.finalRestoration,
    notes: typeof raw.notes === "string" ? raw.notes : "",
  };
}
