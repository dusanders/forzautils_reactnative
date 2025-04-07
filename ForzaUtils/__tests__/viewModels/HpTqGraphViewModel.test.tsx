import { useHpTqGraphViewModel } from "../../src/context/viewModels/HpTqGraphViewModel";
import { ForzaContextProvider, useForzaData } from "../../src/context/Forza";
import { useLogger } from "../../src/context/Logger";
import { act, renderHook } from "@testing-library/react-native";
import { mockNetInfo, mockSocket } from "../../__mocks__/udp.mock";

jest.mock('react-native-udp', () => {
  return {
    createSocket: jest.fn(() => {
      return mockSocket;
    }),
  };
})
jest.mock("../../src/context/Forza", () => {
  const actual = jest.requireActual("../../src/context/Forza");
  return {
    ...actual,
    useForzaData: jest.fn(),
  };
});

jest.mock("../../src/context/Logger");

describe("HpTqGraphViewModel", () => {
  const mockForzaData = {
    packet: {
      isRaceOn: true,
      throttle: 60,
      gear: 3,
      getHorsepower: jest.fn(() => 200),
      torque: 300,
      rpmData: { current: 4500 },
    },
  };
  const mockForzaData2 = {
    packet: {
      isRaceOn: true,
      throttle: 60,
      gear: 2,
      getHorsepower: jest.fn(() => 200),
      torque: 300,
      rpmData: { current: 4500 },
    },
  };

  const mockLogger = {
    log: jest.fn(),
  };

  beforeEach(() => {
    (useLogger as jest.Mock).mockReturnValue(mockLogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ForzaContextProvider netInfo={mockNetInfo}>{children}</ForzaContextProvider>
  );

  it("should initialize with empty gears", () => {
    (useForzaData as jest.Mock).mockReturnValue({
      packet: undefined,
    });

    const { result } = renderHook(() => useHpTqGraphViewModel(), { wrapper });

    expect(result.current.gears).toEqual([]);
  });

  it("should insert a new event when a valid packet is received", () => {
    (useForzaData as jest.Mock).mockReturnValue(mockForzaData);

    const { result, rerender } = renderHook(() => useHpTqGraphViewModel(), { wrapper });

    // Verify the first packet is processed
    expect(result.current.gears.length).toBe(1);
    expect(result.current.gears[0].gear).toBe(mockForzaData.packet.gear);
    expect(result.current.gears[0].events.length).toBe(1);

    // Mock a new packet and rerender
    (useForzaData as jest.Mock).mockReturnValue(mockForzaData2);

    act(() => {
      rerender({});
    });

    // Verify the second packet is processed
    expect(result.current.gears.length).toBe(2); // Ensure we have two gears
    expect(result.current.gears[1].gear).toBe(mockForzaData2.packet.gear);
  });

  it("should clear the cache when clearCache is called", () => {
    const { result } = renderHook(() => useHpTqGraphViewModel(), { wrapper });

    act(() => {
      result.current.clearCache();
    });

    expect(result.current.gears).toEqual([]);
    expect(mockLogger.log).toHaveBeenCalledWith("HpTqGraphViewModel", "clearing cache");
  });

  it("should ignore packets with invalid data", () => {
    (useForzaData as jest.Mock).mockReturnValue({
      packet: {
        isRaceOn: false,
        throttle: 0,
        gear: 0,
        getHorsepower: jest.fn(() => -1),
        torque: 0,
        rpmData: { current: 0 },
      },
    });

    const { result } = renderHook(() => useHpTqGraphViewModel(), { wrapper });

    expect(result.current.gears).toEqual([]);
  });

  it("should update an existing event if new data has higher hp or tq", () => {
    (useForzaData as jest.Mock).mockReturnValue(mockForzaData);

    const { result, rerender } = renderHook(() => useHpTqGraphViewModel(), { wrapper });

    const initialEvent = result.current.gears[0].events[0];

    // Mock a new packet with higher hp and tq
    (useForzaData as jest.Mock).mockReturnValue({
      packet: {
        isRaceOn: true,
        throttle: 60,
        gear: 3,
        getHorsepower: jest.fn(() => initialEvent.hp + 50),
        torque: initialEvent.tq + 50,
        rpmData: { current: initialEvent.rpm },
      },
    });

    act(() => {
      rerender({});
    });

    const updatedEvent = result.current.gears[0].events.find((e) => e.rpm === initialEvent.rpm);

    expect(updatedEvent?.hp).toBeGreaterThan(initialEvent.hp);
    expect(updatedEvent?.tq).toBeGreaterThan(initialEvent.tq);
  });
});