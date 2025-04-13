import { useSelector } from "react-redux";
import { useSuspensionGraphViewModel } from "../../src/context/viewModels/SuspensionGraphViewModel";
import { getForzaPacket } from "../../src/redux/WifiStore";
import { renderHook } from "@testing-library/react-native";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

describe("SuspensionGraphViewModel", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return default values when forza packet is undefined", () => {
    (useSelector as unknown as jest.Mock).mockReturnValue(undefined);

    const { result } = renderHook(() => useSuspensionGraphViewModel());

    expect(result.current).toEqual({
      leftFront: 0,
      leftRear: 0,
      rightFront: 0,
      rightRear: 0,
      windowSize: 20,
      avgTravel: []
    });
  });

  it("should return correct suspension values from forza packet", () => {
    const mockForzaPacket = {
      normalizedSuspensionTravel: {
        leftFront: 0.5,
        leftRear: 0.6,
        rightFront: 0.7,
        rightRear: 0.8,
      },
    };
    (useSelector as unknown as jest.Mock).mockReturnValue(mockForzaPacket);

    const { result } = renderHook(() => useSuspensionGraphViewModel());

    expect(result.current).toEqual({
      leftFront: 0.5,
      leftRear: 0.6,
      rightFront: 0.7,
      rightRear: 0.8,
      windowSize: 20,
      avgTravel: [
        {
          front: 0.6,
          rear: 0.7
        }
      ]
    });
  });

  it("should handle missing normalizedSuspensionTravel gracefully", () => {
    const mockForzaPacket = {};
    (useSelector as unknown as jest.Mock).mockReturnValue(mockForzaPacket);

    const { result } = renderHook(() => useSuspensionGraphViewModel());

    expect(result.current).toEqual({
      leftFront: 0,
      leftRear: 0,
      rightFront: 0,
      rightRear: 0,
      windowSize: 20,
      avgTravel: []
    });
  });
});