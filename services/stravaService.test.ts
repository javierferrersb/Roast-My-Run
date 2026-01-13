import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getAccessToken,
  refreshAccessToken,
  getValidAccessToken,
  getRecentActivities,
} from "./stravaService";

// Mock fetch globally
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe("stravaService", () => {
  const MOCK_CLIENT_ID = "12345";
  const MOCK_CLIENT_SECRET = "secret";

  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("NEXT_PUBLIC_STRAVA_CLIENT_ID", MOCK_CLIENT_ID);
    vi.stubEnv("STRAVA_CLIENT_SECRET", MOCK_CLIENT_SECRET);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // --- getAccessToken ---
  describe("getAccessToken", () => {
    it("should return null if authCode is empty", async () => {
      expect(await getAccessToken("")).toBeNull();
      expect(await getAccessToken("   ")).toBeNull();
    });

    it("should return null if env vars are missing", async () => {
      vi.stubEnv("NEXT_PUBLIC_STRAVA_CLIENT_ID", "");
      expect(await getAccessToken("code")).toBeNull();
    });

    it("should return token data on success", async () => {
      const mockResponse = {
        access_token: "access_123",
        refresh_token: "refresh_123",
        expires_at: 1234567890,
        expires_in: 3600,
        athlete: { id: 1 },
      };
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getAccessToken("valid_code");
      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        "https://www.strava.com/api/v3/oauth/token",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            client_id: 12345,
            client_secret: "secret",
            code: "valid_code",
            grant_type: "authorization_code",
          }),
        }),
      );
    });

    it("should return null on API error", async () => {
      fetchMock.mockResolvedValue({
        ok: false,
      });
      expect(await getAccessToken("code")).toBeNull();
    });

    it("should return null on fetch exception", async () => {
      fetchMock.mockRejectedValue(new Error("Network error"));
      expect(await getAccessToken("code")).toBeNull();
    });
  });

  // --- refreshAccessToken ---
  describe("refreshAccessToken", () => {
    it("should return null if refreshToken is missing", async () => {
      expect(await refreshAccessToken("")).toBeNull();
    });

    it("should return new tokens on success", async () => {
      const mockResponse = {
        access_token: "new_access",
        refresh_token: "new_refresh",
        expires_at: 9999999999,
        expires_in: 3600,
      };
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await refreshAccessToken("old_refresh");
      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        "https://www.strava.com/api/v3/oauth/token",
        expect.objectContaining({
          body: JSON.stringify({
            client_id: 12345,
            client_secret: "secret",
            grant_type: "refresh_token",
            refresh_token: "old_refresh",
          }),
        }),
      );
    });

    it("should return null on failure", async () => {
      fetchMock.mockResolvedValue({ ok: false });
      expect(await refreshAccessToken("refresh")).toBeNull();
    });
  });

  // --- getValidAccessToken ---
  describe("getValidAccessToken", () => {
    it("should return existing access token if valid", async () => {
      const future = Date.now() + 100000;
      const result = await getValidAccessToken(
        "valid_token",
        "refresh_token",
        future.toString(),
      );
      expect(result.accessToken).toBe("valid_token");
      expect(result.newTokens).toBeNull();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("should refresh token if expired", async () => {
      const past = Date.now() - 1000;
      const mockResponse = {
        access_token: "new_access",
        refresh_token: "new_refresh",
        expires_at: 9999999999,
        expires_in: 3600,
      };
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getValidAccessToken(
        "expired_token",
        "refresh_token",
        past.toString(),
      );
      expect(result.accessToken).toBe("new_access");
      expect(result.newTokens).toEqual(mockResponse);
    });

    it("should return null if refresh fails", async () => {
      const past = Date.now() - 1000;
      fetchMock.mockResolvedValue({ ok: false });

      const result = await getValidAccessToken(
        "expired",
        "refresh",
        past.toString(),
      );
      expect(result.accessToken).toBeNull();
    });
  });

  // --- getRecentActivities ---
  describe("getRecentActivities", () => {
    it("should return empty array if access token is missing", async () => {
      expect(await getRecentActivities("")).toEqual([]);
    });

    it("should return activities on success", async () => {
      const mockActivities = [
        {
          id: 1,
          name: "Run 1",
          distance: 1000,
          moving_time: 300,
          total_elevation_gain: 10,
          average_heartrate: 150,
          type: "Run",
          start_date: "2023-01-01",
          sport_type: "Run",
          extra_field: "ignored", // This should be filtered out
        },
      ];

      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockActivities,
      });

      const result = await getRecentActivities("token", 5);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 1,
        name: "Run 1",
        distance: 1000,
        moving_time: 300,
        total_elevation_gain: 10,
        average_heartrate: 150,
        type: "Run",
        start_date: "2023-01-01",
        sport_type: "Run",
      });
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/activities?per_page=5"),
        expect.any(Object),
      );
    });

    it("should return empty array on API error", async () => {
      fetchMock.mockResolvedValue({ ok: false });
      expect(await getRecentActivities("token")).toEqual([]);
    });

    it("should return empty array on fetch exception", async () => {
      fetchMock.mockRejectedValue(new Error("Fail"));
      expect(await getRecentActivities("token")).toEqual([]);
    });
  });
});
