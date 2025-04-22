import React from "react";
import { render, act } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CacheProvider, useCache } from "../../src/context/Cache";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe("Cache Context", () => {
  const TestComponent = () => {
    const cache = useCache();

    React.useEffect(() => {
      (async () => {
        await cache.setItem("testKey", { data: "testValue" });
        const value = await cache.getItem("testKey");
      })();
    }, [cache]);

    return null;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should set and get an item from AsyncStorage", async () => {
    const mockSetItem = AsyncStorage.setItem as jest.Mock;
    const mockGetItem = AsyncStorage.getItem as jest.Mock;

    mockGetItem.mockResolvedValueOnce(JSON.stringify({ data: "testValue" }));


    const component = render(
      <CacheProvider>
        <TestComponent />
      </CacheProvider>
    )
    await act(async () => {
      // Wait for any pending effects or async operations
    });

    expect(mockSetItem).toHaveBeenCalledWith(
      "testKey",
      JSON.stringify({ data: "testValue" })
    );
    expect(mockGetItem).toHaveBeenCalledWith("testKey");
  });

  it("should return null if the item does not exist in AsyncStorage", async () => {
    const mockGetItem = AsyncStorage.getItem as jest.Mock;

    mockGetItem.mockResolvedValueOnce(null);

    let result: any = null;

    const TestComponent = () => {
      const cache = useCache();

      React.useEffect(() => {
        (async () => {
          result = await cache.getItem("nonExistentKey");
        })();
      }, [cache]);

      return null;
    };

    const component = render(
      <CacheProvider>
        <TestComponent />
      </CacheProvider>
    )
    await act(async () => {
      // Wait for any pending effects or async operations
    });

    expect(mockGetItem).toHaveBeenCalledWith("nonExistentKey");
    expect(result).toBeNull();
  });
});