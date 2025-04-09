import { renderHook } from "@testing-library/react-native";
import { useTireTempsViewModel } from "../../src/context/viewModels/TireTempViewModel";
import { useSelector } from "react-redux";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

describe("useTireTempsViewModel", () => {
  it("should return default values when forza packet is undefined", () => {
    (useSelector as unknown as jest.Mock).mockReturnValue(undefined);

    const { result } = renderHook(() => useTireTempsViewModel());

    expect(result.current).toEqual({
      leftFront: 0,
      rightFront: 0,
      leftRear: 0,
      rightRear: 0,
    });
  });

  it("should return correct tire temperatures when forza packet is provided", () => {
    (useSelector as unknown as jest.Mock).mockReturnValue({
      tireTemp: {
        leftFront: 75.1234,
        rightFront: 80.5678,
        leftRear: 70.9876,
        rightRear: 85.4321,
      },
    });

    const { result } = renderHook(() => useTireTempsViewModel());

    expect(result.current).toEqual({
      leftFront: 75.12,
      rightFront: 80.57,
      leftRear: 70.99,
      rightRear: 85.43,
    });
  });

  it("should handle missing tireTemp properties gracefully", () => {
    (useSelector as unknown as jest.Mock).mockReturnValue({
      tireTemp: {
        leftFront: 75.1234,
        rightFront: undefined,
        leftRear: null,
        rightRear: 85.4321,
      },
    });

    const { result } = renderHook(() => useTireTempsViewModel());

    expect(result.current).toEqual({
      leftFront: 75.12,
      rightFront: 0,
      leftRear: 0,
      rightRear: 85.43,
    });
  });
});