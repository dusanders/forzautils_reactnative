import { useHpTqGraphViewModel } from "../../src/context/viewModels/HpTqGraphViewModel";
import { useSelector } from "react-redux";
import { renderHook } from "@testing-library/react-native";
import { act } from "react";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("../../src/context/Logger", () => ({
  useLogger: () => ({
    log: jest.fn(),
  }),
}));

jest.mock("../../src/constants/types", () => ({
  delay: jest.fn(() => Promise.resolve()),
}));

describe("useHpTqGraphViewModel", () => {
  const mockForzaPacket = (overrides = {}) => ({
    isRaceOn: true,
    throttle: 60,
    gear: 3,
    power: 149253.7313428,
    torque: 300,
    rpmData: { current: 4500 },
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with empty gears", () => {
    (useSelector as unknown as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() => useHpTqGraphViewModel());

    expect(result.current.gears).toEqual([]);
  });

  it("should insert a new event when a valid packet is received", () => {
    const forzaPacket = mockForzaPacket();
    (useSelector as unknown as jest.Mock).mockReturnValue(forzaPacket);

    const { result } = renderHook(() => useHpTqGraphViewModel());

    expect(result.current.gears).toHaveLength(1);
    expect(result.current.gears[0].gear).toBe(forzaPacket.gear);
    expect(result.current.gears[0].events).toHaveLength(1);
  });

  it("should ignore packets with invalid data", () => {
    const forzaPacket = mockForzaPacket({ isRaceOn: false });
    (useSelector as unknown as jest.Mock).mockReturnValue(forzaPacket);

    const { result } = renderHook(() => useHpTqGraphViewModel());

    expect(result.current.gears).toEqual([]);
  });

  it("should clear the cache when clearCache is called", () => {
    const forzaPacket = mockForzaPacket();
    (useSelector as unknown as jest.Mock).mockReturnValue(forzaPacket);

    const { result } = renderHook(() => useHpTqGraphViewModel());

    expect(result.current.gears).not.toEqual([]);

    act(() => {
      result.current.clearCache();
    });

    expect(result.current.gears).toEqual([]);
  });

  it("should update an existing event if new data has higher hp or tq", () => {
    const forzaPacket = mockForzaPacket();
    (useSelector as unknown as jest.Mock).mockReturnValue(forzaPacket);

    const { result, rerender } = renderHook(() => useHpTqGraphViewModel());
    expect(result.current.gears[0].events[0].hp).toBe(200);

    const updatedPacket = mockForzaPacket({
      power: 186425.25838541,
      torque: 350,
    });

    act(() => {
      (useSelector as unknown as jest.Mock).mockReturnValue(updatedPacket);
      rerender({})
    });

    expect(result.current.gears.length).toBe(1);
    expect(result.current.gears[0].events[0].hp).toBe(250);
  });

  it("should not update an existing event if new data has lower hp or tq", () => {
    const forzaPacket = mockForzaPacket();
    (useSelector as unknown as jest.Mock).mockReturnValue(forzaPacket);

    let { result, rerender } = renderHook(() => useHpTqGraphViewModel());
    expect(result.current.gears[0].events[0].hp).toBe(200);

    const updatedPacket = mockForzaPacket({
      power: 111855.15503124,
      torque: 250,
    });

    act(() => {
      (useSelector as unknown as jest.Mock).mockReturnValue(updatedPacket);
      rerender({})
    });

    expect(result.current.gears.length).toBe(1);
    expect(result.current.gears[0].events[0].hp).toBe(200);
  });
});