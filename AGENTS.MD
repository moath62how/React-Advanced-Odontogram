# Odontogram package guidance

When working with the dental chart, use the installed `react-advanced-odontogram` package. This project installs it from the local source folder configured in `package.json`.

## Integration pattern

- Follow the package README's custom-controls pattern: render `OdontogramProvider` around `OdontogramChartSurface`, then render this app's custom controls inside the provider.
- Import custom-control APIs from `react-advanced-odontogram/controls` and import `react-advanced-odontogram/style.css` once (already imported in `src/main.tsx`).
- For custom buttons, use the package's selection-based `*ForSelection` functions. Use `useEngineState(getSelectedTeeth)` to subscribe to selection changes; disable actions when no teeth are selected. Do not mutate package DOM or internal engine state directly.
- The current integration and examples are in `src/App.tsx`. Keep its language, numbering-system, theme, and feature options wired through `OdontogramProvider`.
- Use the exact exported names and parameter types from the installed package declarations; check `node_modules/react-advanced-odontogram/dist/index.d.ts` before assuming a setter/getter exists. The package README is in the local source folder at `../../Freelace projects/ChartRemix/React-Advanced-Odontogram/README.md`.

## Application palette

- The app's base color tokens live in `src/index.css` under `:root`; use these variables for UI styling instead of adding hard-coded theme colors.
- Keep the `.dark` surface overrides and `--odon-*` theme configuration behavior intact when changing the shared tokens.

## Tooth settings catalog

`node_modules/react-advanced-odontogram/tooth-settings.json` describes the chart's FDI tooth set and persisted setting categories. It is a catalog/schema aid, **not** a list of React props or callable functions. Do not invent a setter by converting a JSON field name into a function name; confirm the public API in the package declarations.

- Permanent FDI teeth: `11`–`18`, `21`–`28`, `31`–`38`, and `41`–`48`.
- Primary FDI teeth: `51`–`55`, `61`–`65`, `71`–`75`, and `81`–`85`.
- Shared setting categories include `toothSelection`, `toothSubstrate`, `caries`, `cariesSeverity`, `rootCaries`, `restoration`, `pulpAndApicalDiagnosis`, `orthodontics`, `toothDetails`, `periodontalFindings`, `diagnoses`, and `notesAndExtensions`.
- The catalog's values include selection (`none`, `tooth-base`, `milktooth`, `implant`, `tooth-under-gum`), substrate (`natural`, `radix`, `broken`, `crownprep`), caries surfaces (`buccal`, `lingual`, `mesial`, `distal`, `occlusal`, plus `caries-subcrown`), root caries (`none`, `active`, `arrested`, `active-cavitated`), and surface caries severity `0`–`6`.
- Some data is conditional: `periImplant` applies to implant teeth; `perio` is periodontal chart data; caries severity is per surface. Preserve these constraints when building controls or interpreting/exporting data.
- The chart supports other numbering systems. The catalog itself declares FDI; do not assume its tooth identifiers change when the UI numbering display changes.

## Public API examples

Selection-aware custom buttons should follow this pattern:

```tsx
const selectedTeeth = useEngineState(getSelectedTeeth)

<button
  type="button"
  disabled={selectedTeeth.length === 0}
  onClick={() => setToothSelectionForSelection('implant')}
>
  Mark selected teeth as implants
</button>
```

Examples of declared selection setters include `setToothSelectionForSelection`, `setSubstrateForSelection`, `setCariesSurfaceForSelection`, `setRootCariesForSelection`, `setRestorationForSelection`, `setPulpEndoForSelection`, `setApicalDxForSelection`, `setOrthoApplianceForSelection`, `setMobilityForSelection`, `setPeriImplantForSelection`, `setExtractionPlanForSelection`, and `setMissingClosedForSelection`. These APIs accept the selected teeth, not an arbitrary tooth number; use their declared arguments and valid values.

Use the typed public export/import and chart APIs (for example `exportStatus`, `importStatus`, `exportFhir`, `exportSvg`, and `exportImage`) when needed. Check their declarations for behavior and argument types before wiring UI.

## Validation

After changing chart integration or controls, run:

```sh
npm run build
npm run lint
```
