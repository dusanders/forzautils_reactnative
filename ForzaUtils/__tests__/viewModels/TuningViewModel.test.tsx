import { Drivetrain } from "ForzaTelemetryApi";
import { useTuningViewModel, EngineLayout } from "../../src/context/viewModels/TuningViewModel";
import { act, renderHook } from "@testing-library/react-native";

jest.mock("../../src/context/Cache", () => ({
  useCache: jest.fn(() => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
  })),
}));

describe("TuningViewModel", () => {
  it("should initialize with default values", () => {
    const { result } = renderHook(() => useTuningViewModel());

    expect(result.current.totalVehicleWeight).toBe(3000);
    expect(result.current.frontDistribution).toBe(53);
    expect(result.current.rearDistribution).toBe(47);
    expect(result.current.hasRollCage).toBe(false);
    expect(result.current.drivetrain).toBe(Drivetrain.FWD);
    expect(result.current.engineLayout).toBe(EngineLayout.FRONT);
    expect(result.current.frontHeight).toBe(4.0);
    expect(result.current.rearHeight).toBe(4.0);
    expect(result.current.frontHz).toBe(2.6);
    expect(result.current.rearHz).toBe(2.6);
  });

  it("should update total vehicle weight", () => {
    const { result } = renderHook(() => useTuningViewModel());

    act(() => {
      result.current.setTotalVehicleWeight(3500);
    });

    expect(result.current.totalVehicleWeight).toBe(3500);
  });

  it("should update front and rear distribution", () => {
    const { result } = renderHook(() => useTuningViewModel());

    act(() => {
      result.current.setFrontDistribution(60);
    });

    expect(result.current.frontDistribution).toBe(60);
    expect(result.current.rearDistribution).toBe(40);

    act(() => {
      result.current.setRearDistribution(50);
    });

    expect(result.current.rearDistribution).toBe(50);
    expect(result.current.frontDistribution).toBe(50);
  });

  it("should update roll cage status", () => {
    const { result } = renderHook(() => useTuningViewModel());

    act(() => {
      result.current.setHasRollCage(true);
    });

    expect(result.current.hasRollCage).toBe(true);
  });

  it("should update drivetrain type", () => {
    const { result } = renderHook(() => useTuningViewModel());

    act(() => {
      result.current.setDrivetrain(Drivetrain.RWD);
    });

    expect(result.current.drivetrain).toBe(Drivetrain.RWD);
  });

  it("should update engine layout", () => {
    const { result } = renderHook(() => useTuningViewModel());

    act(() => {
      result.current.setEngineLayout(EngineLayout.MID);
    });

    expect(result.current.engineLayout).toBe(EngineLayout.MID);
  });

  it("should update front and rear ride heights", () => {
    const { result } = renderHook(() => useTuningViewModel());

    act(() => {
      result.current.setFrontHeight(6.0);
    });

    expect(result.current.frontHeight).toBe(6.0);

    act(() => {
      result.current.setRearHeight(4.5);
    });

    expect(result.current.rearHeight).toBe(4.5);
  });

  it("should calculate front and rear weights correctly", () => {
    const { result } = renderHook(() => useTuningViewModel());

    act(() => {
      result.current.setTotalVehicleWeight(4000);
      result.current.setFrontDistribution(60);
    });

    expect(result.current.frontWeight).toBeCloseTo(2400);
    expect(result.current.rearWeight).toBeCloseTo(1600);
    expect(result.current.frontCornerWeight).toBeCloseTo(1200);
    expect(result.current.rearCornerWeight).toBeCloseTo(800);
  });

  it("should adjust suspension settings based on layout and drivetrain", () => {
    const { result } = renderHook(() => useTuningViewModel());

    act(() => {
      result.current.setEngineLayout(EngineLayout.REAR);
      result.current.setDrivetrain(Drivetrain.RWD);
    });

    expect(result.current.engineLayout).toBe(EngineLayout.REAR);
    expect(result.current.drivetrain).toBe(Drivetrain.RWD);
    expect(result.current.frontSettings).toBeDefined();
    expect(result.current.rearSettings).toBeDefined();
  });
});