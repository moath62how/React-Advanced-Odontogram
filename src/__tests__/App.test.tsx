// Part of React Advanced Odontogram - https://github.com/ZoliQua/React-Advanced-Odontogram
// Created by Zoltan Dul (https://github.com/ZoliQua) 2025-2026

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup, within } from '@testing-library/react';
import App from '../App';
import {
  setSecondaryCariesMode,
  setIcdasEnabled,
  setPulpDetailLevel,
  setNotesEnabled,
} from '../odontogram';

// Mock odontogram.ts since it manipulates real DOM and SVGs
vi.mock('../odontogram', () => ({
  initOdontogram: vi.fn().mockResolvedValue(undefined),
  destroyOdontogram: vi.fn(),
  rewireControls: vi.fn(),
  // Composable-UI Tier 3: OrthodonticsCard reads these engine exports.
  getActiveOrtho: vi.fn().mockReturnValue(null),
  getActiveCaries: vi.fn().mockReturnValue({ surfaces: [], subcrownChecked: false, subcrownDisabled: true, subcrownLabel: "", cariesActiveDepth: 2, rootCariesDisplay: "none", cariesDepthVisible: true, rootCariesVisible: true, cariesSectionVisible: true }),
  getCariesDepthOptions: vi.fn().mockReturnValue([]),
  rootCariesOptions: vi.fn().mockReturnValue([]),
  setCariesSurfaceForSelection: vi.fn(),
  setCariesActiveDepthForSelection: vi.fn(),
  setRootCariesForSelection: vi.fn(),
  openCariesDepthPopup: vi.fn(),
  getActiveFillings: vi.fn().mockReturnValue({ surfaces: [], fillingMaterial: "none", fillingOptions: [], surfaceGridVisible: false, defectDisabled: false, simpleMode: false, simpleRowVisible: false, simpleToggleChecked: false, simpleDefectRowVisible: false, simpleDefectValue: "none", simpleDefectOptions: [], fissureSealing: false, fissureRowVisible: true, fillingSectionVisible: true, subcariesSummary: "", defectSummary: "" }),
  setFillingMaterialForSelection: vi.fn(),
  setFillingSurfaceForSelection: vi.fn(),
  setFillingSimpleToggleForSelection: vi.fn(),
  setFillingSimpleDefectForSelection: vi.fn(),
  setFissureSealingForSelection: vi.fn(),
  openFillingDefectPopup: vi.fn(),
  getActiveRootPerio: vi.fn().mockReturnValue({ sectionVisible: true, rootBlockVisible: true, perioBlockVisible: true, pulpEndoValue: "normal", pulpEndoNoneOption: null, pulpEndoGroups: [], pulpEndoDisabled: false, apicalDxValue: "normal", apicalDxOptions: [], apicalDxDisabled: false, apicalDxRowVisible: true, periapicalTypeValue: "none", periapicalTypeOptions: [], periapicalRowVisible: false, resorptionValue: "none", resorptionOptions: [], resorptionDisabled: false, resorptionRowVisible: true, endoResectionChecked: false, endoResectionDisabled: false, parapulpalPinChecked: false, parapulpalPinDisabled: false, mobilityValue: "none", mobilityOptions: [], mobilityDisabled: false, mobilityRowVisible: true, perioRowVisible: true, mods: [], calculusChecked: false, calculusRowVisible: false, periImplantValue: "none", periImplantOptions: [], periImplantRowVisible: false }),
  setPulpEndoForSelection: vi.fn(),
  setApicalDxForSelection: vi.fn(),
  setPeriapicalTypeForSelection: vi.fn(),
  setResorptionForSelection: vi.fn(),
  setEndoResectionForSelection: vi.fn(),
  setParapulpalPinForSelection: vi.fn(),
  setMobilityForSelection: vi.fn(),
  setModForSelection: vi.fn(),
  setCalculusForSelection: vi.fn(),
  setPeriImplantForSelection: vi.fn(),
  // DX-2 Task 4: DiagnosesCard (mounted unconditionally as part of ToothControlsSurface) reads/writes these.
  getActiveDiagnoses: vi.fn().mockReturnValue({ visible: false, rows: [], addableKeys: [] }),
  setDxOverrideForSelection: vi.fn(),
  getActiveToothDetails: vi.fn().mockReturnValue({ toothSelectValue: "tooth-base", toothSelectOptions: [], substrateValue: "natural", substrateOptions: [], substrateRowVisible: true, extractionWoundChecked: false, extractionRowVisible: true, missingClosedChecked: false, missingClosedRowVisible: true, restorationValue: "none|none", restorationOptions: [], restorationRowVisible: true, crownLeakageChecked: false, crownLeakageRowVisible: false, brokenMesialChecked: false, brokenIncisalChecked: false, brokenDistalChecked: false, brokenCrownRowVisible: true, contactMesialChecked: false, contactDistalChecked: false, contactPointRowVisible: true, bruxismRowVisible: true, wearSimple: false, wearEdgeValue: "none", wearEdgeOptions: [], wearEdgeToggleChecked: false, wearCervicalValue: "none", wearCervicalOptions: [], wearCervicalToggleChecked: false, discolorationRowVisible: true, discoSimple: false, discolorationValue: "none", discolorationOptions: [], discolorationToggleChecked: false, crownActionsRowVisible: true, bridgePillarChecked: false, bridgePillarRowVisible: true, extractionPlanChecked: false, extractionPlanRowVisible: true, extractionPlanParent: "crownActionsRow", crownReplaceChecked: false, crownReplaceRowVisible: true, crownNeededChecked: false, crownNeededRowVisible: true }),
  setToothSelectionForSelection: vi.fn(),
  setSubstrateForSelection: vi.fn(),
  setRestorationForSelection: vi.fn(),
  setExtractionWoundForSelection: vi.fn(),
  setExtractionPlanForSelection: vi.fn(),
  setMissingClosedForSelection: vi.fn(),
  setCrownLeakageForSelection: vi.fn(),
  setBrokenMesialForSelection: vi.fn(),
  setBrokenIncisalForSelection: vi.fn(),
  setBrokenDistalForSelection: vi.fn(),
  setContactMesialForSelection: vi.fn(),
  setContactDistalForSelection: vi.fn(),
  setWearEdgeForSelection: vi.fn(),
  setWearCervicalForSelection: vi.fn(),
  setWearEdgeToggleForSelection: vi.fn(),
  setWearCervicalToggleForSelection: vi.fn(),
  setDiscolorationForSelection: vi.fn(),
  setDiscolorationToggleForSelection: vi.fn(),
  setBridgePillarForSelection: vi.fn(),
  setCrownReplaceForSelection: vi.fn(),
  setCrownNeededForSelection: vi.fn(),
  resetTooth: vi.fn(),
  getEdentulous: vi.fn().mockReturnValue(false),
  setEdentulous: vi.fn(),
  resetMouth: vi.fn(),
  applyPrimaryDentition: vi.fn(),
  applyMixedDentition: vi.fn(),
  getStatusExtras: vi.fn().mockReturnValue([]),
  applyStatusExtra: vi.fn(),
  getOrthoApplianceOptions: vi.fn().mockReturnValue([]),
  getOrthoDriftOptions: vi.fn().mockReturnValue([]),
  getOrthoVerticalOptions: vi.fn().mockReturnValue([]),
  setOrthoApplianceForSelection: vi.fn(),
  setOrthoDriftForSelection: vi.fn(),
  setOrthoVerticalForSelection: vi.fn(),
  setOrthoRotationForSelection: vi.fn(),
  rebuildGrid: vi.fn().mockResolvedValue(undefined),
  setNumberingSystem: vi.fn(),
  clearSelection: vi.fn(),
  setOcclusalVisible: vi.fn(),
  setWisdomVisible: vi.fn(),
  setShowBase: vi.fn(),
  setHealthyPulpVisible: vi.fn(),
  registerPlugins: vi.fn(),
  setPluginState: vi.fn(),
  getPluginState: vi.fn(),
  getToothStateSummary: vi.fn().mockReturnValue([]),
  setReadOnly: vi.fn(),
  getReadOnly: vi.fn().mockReturnValue(false),
  setNotesEnabled: vi.fn(),
  getNotesEnabled: vi.fn().mockReturnValue(false),
  setIcdasEnabled: vi.fn(),
  getIcdasEnabled: vi.fn().mockReturnValue(false),
  setPulpDetailLevel: vi.fn(),
  getPulpDetailLevel: vi.fn().mockReturnValue('aae'),
  setSecondaryCariesMode: vi.fn(),
  getSecondaryCariesMode: vi.fn().mockReturnValue('standard'),
  setRootCariesMode: vi.fn(),
  getRootCariesMode: vi.fn().mockReturnValue('simple'),
  setRadiographicDepthMode: vi.fn(),
  getRadiographicDepthMode: vi.fn().mockReturnValue('off'),
  setCariesDepthEnabled: vi.fn(),
  getCariesDepthEnabled: vi.fn().mockReturnValue(true),
  setWearDetailLevel: vi.fn(),
  getWearDetailLevel: vi.fn().mockReturnValue('complex'),
  setDiscolorationDetailLevel: vi.fn(),
  getDiscolorationDetailLevel: vi.fn().mockReturnValue('complex'),
  setSurfaceNotation: vi.fn(),
  getSurfaceNotation: vi.fn().mockReturnValue('full'),
  hasAnyPerioData: vi.fn().mockReturnValue(false),
  getCaseMeta: vi.fn().mockReturnValue({
    age: null, smokingStatus: 'unknown', cigarettesPerDay: null,
    diabetesStatus: 'unknown', hba1c: null, toothLossPerio: null, maxRblPercent: null,
    diagnosisOverride: null, stageOverride: null, gradeOverride: null, extentOverride: null,
    patientName: null, examDate: null,
  }),
  setPatientName: vi.fn(),
  setExamDate: vi.fn(),
  exportPdf: vi.fn().mockResolvedValue(undefined),
  getOdontogramSummary: vi.fn().mockReturnValue({
    overview: '', permanentList: null, missingList: null,
    sections: [], implants: null, toothTable: { columns: [], rows: [], legend: "" }, periodontalHasFindings: false, periodontalTitle: '', periodontalText: '',
  }),
  onStateChange: vi.fn().mockReturnValue(() => {}),
  openPerioOverlay: vi.fn(),
  closePerioOverlay: vi.fn(),
  isPerioOverlayOpen: vi.fn().mockReturnValue(false),
  getPerioViewMode: vi.fn().mockReturnValue('toggle'),
  getDiagnosisCodingPack: vi.fn().mockReturnValue("none"),
  getSnomedEnabled: vi.fn().mockReturnValue(false),
    getFillingDefectEnabled: vi.fn().mockReturnValue(true),
    setFillingDefectEnabled: vi.fn(),
    getFillingComplexity: vi.fn().mockReturnValue("complex"),
    setFillingComplexity: vi.fn(),
    getFissureSealingEnabled: vi.fn().mockReturnValue(true),
    setFissureSealingEnabled: vi.fn(),
    getFillingMaterialAvailability: vi.fn().mockReturnValue({ amalgam: true, composite: true, gic: true, temporary: true }),
    setFillingMaterialAvailability: vi.fn(),
  setPerioViewMode: vi.fn(),
  setDiagnosisCodingPack: vi.fn(),
  setSnomedEnabled: vi.fn(),
  getToothAnatomy: vi.fn().mockReturnValue("classic"),
  getScreenToothSpacing: vi.fn().mockReturnValue("normal"),
  setScreenToothSpacing: vi.fn(),
  getScreenToothNumberSize: vi.fn().mockReturnValue("normal"),
  setScreenToothNumberSize: vi.fn(),
  getSelectionColor: vi.fn().mockReturnValue("#3b7bff"),
  setSelectionColor: vi.fn(),
  getSelectionBorderStyle: vi.fn().mockReturnValue("dashed"),
  setSelectionBorderStyle: vi.fn(),
  getToothInfoVisible: vi.fn().mockReturnValue(true),
  setToothInfoVisible: vi.fn(),
  setToothAnatomy: vi.fn(),
  getPerioRowVisibility: vi.fn().mockReturnValue({
    plaque: true, bop: true, cal: true, gm: true, pd: true, furcation: true,
    mobility: true, cej: true, rootConcavity: true, pi: true, gi: true,
    mpi: true, mbi: true, kg: true, gt: true, miller: true,
  }),
  setPerioRowVisibility: vi.fn(),
  getPerioIndexNameMode: vi.fn().mockReturnValue('translated'),
  setPerioIndexNameMode: vi.fn(),
  getPdfSettings: vi.fn().mockReturnValue({ defaultName: "John Doe", defaultDob: "1980-01-01", showAge: true, dateFormat: "iso", colorTheme: "blue", showBone: true, showHealthyPulp: true, toothSpacing: "wide", border: false, borderThickness: "medium", borderColor: "#000000", toothNumberSize: "normal", includeOdontogramText: true, includeOdontogramTable: true, perioToothSpacing: "wide", perioShowEmptyRows: true, perioLabelPlacement: "center", perioFontSize: "normal", includePerioTable: true, includePerioAbbrev: true, showDisclaimer: true, disclaimerText: "", summaryGrouping: "jaw", showGenerator: true }),
  setPdfSettings: vi.fn(),
  isDualStateConfirmPending: vi.fn().mockReturnValue(false),
  acceptDualStateConfirm: vi.fn(),
  cancelDualStateConfirm: vi.fn(),
  exportFhir: vi.fn(),
  exportImage: vi.fn(),
  exportSvg: vi.fn(),
  setImportFormat: vi.fn(),
  getChartMode: vi.fn().mockReturnValue('status'),
  setChartMode: vi.fn(),
  getStatusChart: vi.fn().mockReturnValue({ teeth: {} }),
  getPlanChart: vi.fn().mockReturnValue({}),
  setPlanChart: vi.fn(),
  getPlanChanges: vi.fn().mockReturnValue([]),
  exportStatus: vi.fn(),
  importStatus: vi.fn(),
  exportPerioImage: vi.fn().mockResolvedValue(undefined),
  exportPerioSvg: vi.fn().mockResolvedValue(undefined),
}));

describe('App.tsx', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    document.documentElement.classList.remove('dark');
  });

  describe('standalone mode (no props)', () => {
    it('renders without crashing', () => {
      render(<App />);
      // The app title should be visible (multiple elements may match)
      const elements = screen.getAllByText(/odontogram/i);
      expect(elements.length).toBeGreaterThan(0);
    });

    it('renders the topbar with export/import buttons', () => {
      render(<App />);
      const exportBtn = document.getElementById('btnStatusExport');
      const importInput = document.getElementById('statusImportInput');
      expect(exportBtn).toBeInTheDocument();
      expect(importInput).toBeInTheDocument();
    });

    it('renders the tooth grid container', () => {
      render(<App />);
      const grid = document.getElementById('toothGrid');
      expect(grid).toBeInTheDocument();
    });

    it('omits Tooth Information and logs tooth state as JSON', () => {
      const consoleInfo = vi.spyOn(console, 'info').mockImplementation(() => {});
      render(<App />);
      expect(document.querySelector('.tooth-info')).not.toBeInTheDocument();
      expect(consoleInfo).toHaveBeenCalledWith('Odontogram tooth state (JSON):', '{}');
      consoleInfo.mockRestore();
    });

    it('omits the built-in tooth controls panel', () => {
      render(<App />);
      expect(document.querySelector('.panel-odontogram-controls')).not.toBeInTheDocument();
      expect(document.getElementById('statusCard')).not.toBeInTheDocument();
    });

    it('renders chart action buttons', () => {
      render(<App />);
      expect(document.getElementById('btnOcclView')).toBeInTheDocument();
      expect(document.getElementById('btnWisdomVisible')).toBeInTheDocument();
      expect(document.getElementById('btnBoneVisible')).toBeInTheDocument();
      expect(document.getElementById('btnPulpVisible')).toBeInTheDocument();
      expect(document.getElementById('btnSelectNoneChart')).toBeInTheDocument();
    });
  });

  describe('controlled language mode', () => {
    it('uses the provided language', () => {
      const onLangChange = vi.fn();
      render(<App language="en" onLanguageChange={onLangChange} />);
      // The title is a language-independent product name; verify the language via
      // the dynamic subtitle's language clause instead.
      expect(screen.getByText(/in english/i)).toBeInTheDocument();
    });

    it('calls onLanguageChange when language is selected', async () => {
      const onLangChange = vi.fn();
      render(<App language="en" onLanguageChange={onLangChange} />);

      // Open language dropdown (now an icon button identified by its aria-label)
      const langButton = screen.getByRole('button', { name: /Language/i });
      fireEvent.click(langButton);

      // Click on Hungarian option (text includes flag emoji)
      await waitFor(() => {
        const huOption = screen.getByRole('menuitemradio', { name: /Hungarian/i });
        fireEvent.click(huOption);
      });

      expect(onLangChange).toHaveBeenCalledWith('hu');
    });
  });

  describe('controlled numbering mode', () => {
    it('uses the provided numbering system', () => {
      const onNumberingChange = vi.fn();
      render(<App language="en" numberingSystem="UNIVERSAL" onNumberingChange={onNumberingChange} />);
      // Numbering now lives inside the Settings modal (General tab); open it first
      fireEvent.click(screen.getByRole('button', { name: /Settings/i }));
      const select = screen.getByLabelText('Numbering') as HTMLSelectElement;
      expect(select.value).toBe('UNIVERSAL');
    });

    it('calls onNumberingChange when numbering is selected', () => {
      const onNumberingChange = vi.fn();
      render(<App language="en" numberingSystem="FDI" onNumberingChange={onNumberingChange} />);

      // Numbering now lives inside the Settings modal (General tab); open it first
      fireEvent.click(screen.getByRole('button', { name: /Settings/i }));
      const select = screen.getByLabelText('Numbering') as HTMLSelectElement;
      fireEvent.change(select, { target: { value: 'PALMER' } });

      expect(onNumberingChange).toHaveBeenCalledWith('PALMER');
    });
  });

  describe('settings modal', () => {
    const openModal = () => {
      fireEvent.click(screen.getByRole('button', { name: /Settings/i }));
      return screen.getByRole('dialog');
    };

    it('is closed by default and opens from the gear button', () => {
      render(<App language="en" />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      const dialog = openModal();
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('moves focus into the dialog when opened (focus trap)', () => {
      render(<App language="en" />);
      const dialog = openModal();
      expect(dialog.contains(document.activeElement)).toBe(true);
    });

    it('closes on Escape', () => {
      render(<App language="en" />);
      const dialog = openModal();
      fireEvent.keyDown(dialog, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('closes on backdrop click', () => {
      render(<App language="en" />);
      openModal();
      const backdrop = document.querySelector('.odon-settings-backdrop') as HTMLElement;
      fireEvent.mouseDown(backdrop);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders every tab and switches between them', () => {
      render(<App language="en" />);
      const dialog = openModal();
      // Round 2 restructure: Panels→Odontogram, Periodontal→Periodontal Chart
      // (moved up), PDF Settings→Export Settings; Pulp+Notes folded into Tooth
      // details; new Fillings tab. Scope tab lookups to the settings dialog —
      // "Odontogram" also names the top-of-page view-toggle tab.
      const tabNames = ['General', 'Odontogram', 'Periodontal Chart', 'Tooth details', 'Caries', 'Fillings', 'Export Settings'];
      for (const name of tabNames) {
        const tab = within(dialog).getByRole('tab', { name });
        fireEvent.click(tab);
        expect(tab).toHaveAttribute('aria-selected', 'true');
        // The active panel has content
        expect(within(dialog).getByRole('tabpanel')).toBeInTheDocument();
      }
    });

    it('General tab exposes numbering, language and theme controls', () => {
      render(<App language="en" />);
      const dialog = openModal();
      // Scope to the dialog: the topbar keeps its own separate Language button.
      expect(within(dialog).getByLabelText('Numbering')).toBeInTheDocument();
      expect(within(dialog).getByLabelText('Language')).toBeInTheDocument();
      expect(within(dialog).getByLabelText('Appearance')).toBeInTheDocument();
    });

    it('changing the secondary-caries mode calls setSecondaryCariesMode', () => {
      // SP15 Task 4 (B2): the CARS control now lives on the "Caries" tab
      // (merged from the removed standalone "Secondary caries" tab).
      render(<App language="en" />);
      openModal();
      fireEvent.click(screen.getByRole('tab', { name: 'Caries' }));
      const panel = screen.getByRole('tabpanel');
      const select = within(panel).getByLabelText(/Secondary caries/i) as HTMLSelectElement;
      fireEvent.change(select, { target: { value: 'full' } });
      expect(setSecondaryCariesMode).toHaveBeenCalledWith('full');
    });

    it('toggling ICDAS on the Caries tab calls setIcdasEnabled', () => {
      render(<App language="en" />);
      openModal();
      fireEvent.click(screen.getByRole('tab', { name: 'Caries' }));
      const panel = screen.getByRole('tabpanel');
      const toggle = within(panel).getByLabelText('ICDAS') as HTMLInputElement;
      fireEvent.click(toggle);
      expect(setIcdasEnabled).toHaveBeenCalledWith(true);
    });

    it('changing pulp detail level calls setPulpDetailLevel', () => {
      render(<App language="en" />);
      openModal();
      // Round 2: the Pulp-detail control moved to the "Tooth details" tab.
      fireEvent.click(screen.getByRole('tab', { name: 'Tooth details' }));
      const select = screen.getByLabelText(/Pulp detail/i) as HTMLSelectElement;
      fireEvent.change(select, { target: { value: 'latin' } });
      expect(setPulpDetailLevel).toHaveBeenCalledWith('latin');
    });

    it('toggling notes on the Tooth details tab calls setNotesEnabled', () => {
      render(<App language="en" />);
      openModal();
      // Round 2: the Notes toggle moved to the "Tooth details" tab.
      fireEvent.click(screen.getByRole('tab', { name: 'Tooth details' }));
      const panel = screen.getByRole('tabpanel');
      const toggle = within(panel).getByLabelText('Notes') as HTMLInputElement;
      fireEvent.click(toggle);
      expect(setNotesEnabled).toHaveBeenCalledWith(true);
    });
  });

  describe('dark mode', () => {
    it('toggles dark mode when theme button is clicked (standalone)', () => {
      render(<App />);
      // Multiple icon buttons share .btn-theme now; target the dark-mode toggle
      // by its accessible label (light mode shows the "Dark mode" label).
      const themeBtn = screen.getByRole('button', { name: /Dark mode/i }) as HTMLElement;
      expect(themeBtn).toBeInTheDocument();

      // Initially light mode
      expect(document.documentElement.classList.contains('dark')).toBe(false);

      fireEvent.click(themeBtn);
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      fireEvent.click(themeBtn);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('calls onDarkModeChange in controlled mode', () => {
      const onDarkChange = vi.fn();
      render(<App darkMode={false} onDarkModeChange={onDarkChange} />);

      const themeBtn = screen.getByRole('button', { name: /Dark mode/i }) as HTMLElement;
      fireEvent.click(themeBtn);

      expect(onDarkChange).toHaveBeenCalledWith(true);
    });

    it('respects darkMode prop', () => {
      render(<App darkMode={true} />);
      // In controlled mode, the button should show sun icon (switch to light)
      const sunIcon = document.querySelector('.btn-theme svg circle');
      expect(sunIcon).toBeInTheDocument();
    });
  });

});
