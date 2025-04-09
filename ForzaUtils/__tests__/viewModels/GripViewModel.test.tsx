import React from "react";
import { IGripViewModel, useGripViewModel } from "../../src/context/viewModels/GripViewModel";
import { useSelector } from "react-redux";
import { renderHook } from "@testing-library/react-native";
import { ForzaTelemetryApi } from "ForzaTelemetryApi";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

describe("useGripViewModel", () => {
  it("should return default values when no data is available in Redux state", () => {
    ((useSelector as unknown) as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() => useGripViewModel());

    expect(result.current).toEqual({
      steering: 0,
      throttle: 0,
      brake: 0,
      slipRatio: {
        leftFront: 0,
        rightFront: 0,
        leftRear: 0,
        rightRear: 0,
      },
    });
  });

  it("should return correct values when data is available in Redux state", () => {
    const mockData: Partial<ForzaTelemetryApi> = {
      steer: 0.5,
      throttle: 0.8,
      brake: 0.2,
      tireSlipRatio: {
        leftFront: 0.12,
        rightFront: 0.15,
        leftRear: 0.1,
        rightRear: 0.18,
      },
    };
    const expectedResult: IGripViewModel = {
      steering: mockData.steer!,
      throttle: mockData.throttle!,
      brake: mockData.brake!,
      slipRatio: {
        leftFront: mockData.tireSlipRatio!.leftFront,
        rightFront: mockData.tireSlipRatio!.rightFront,
        leftRear: mockData.tireSlipRatio!.leftRear,
        rightRear: mockData.tireSlipRatio!.rightRear
      }
    };

    ((useSelector as unknown) as jest.Mock).mockReturnValue(mockData);

    const { result } = renderHook(() => useGripViewModel());

    expect(result.current).toEqual(expectedResult);
  });

  it("should handle missing tireSlipRatio gracefully", () => {
    const mockData: Partial<ForzaTelemetryApi> = {
      steer: 0.3,
      throttle: 0.6,
      brake: 0.1,
      tireSlipRatio: undefined as any
    };
    const expectedViewModel: IGripViewModel = {
      steering: mockData.steer!,
      throttle: mockData.throttle!,
      brake: mockData.brake!,
      slipRatio: {
        leftFront: 0,
        rightFront: 0,
        rightRear: 0,
        leftRear: 0
      }
    };
    ((useSelector as unknown) as jest.Mock).mockReturnValue(mockData);

    const { result } = renderHook(() => useGripViewModel());

    expect(result.current).toEqual(expectedViewModel);
  });
});