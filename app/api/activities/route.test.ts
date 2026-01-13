import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";
import { NextRequest } from "next/server";
import * as stravaService from "@/services/stravaService";

// Mock the service
vi.mock("@/services/stravaService");

describe("API /api/activities", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const createRequest = (cookies: Record<string, string> = {}, query = "") => {
    const url = `http://localhost:3000/api/activities${query}`;
    const req = new NextRequest(url);
    Object.entries(cookies).forEach(([key, value]) => {
      req.cookies.set(key, value);
    });
    return req;
  };

  it("should return 401 if not authenticated", async () => {
    vi.mocked(stravaService.getValidAccessToken).mockResolvedValue({
      accessToken: null,
      newTokens: null,
    });

    const req = createRequest();
    const res = await GET(req);

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toEqual({ error: "Not authenticated" });
  });

  it("should return run activities when authenticated", async () => {
    vi.mocked(stravaService.getValidAccessToken).mockResolvedValue({
      accessToken: "valid_token",
      newTokens: null,
    });

    const mockActivities: any[] = [
      { id: 1, type: "Run", name: "Run 1" },
      { id: 2, type: "Ride", name: "Ride 1" }, // Should be filtered
    ];
    vi.mocked(stravaService.getRecentActivities).mockResolvedValue(
      mockActivities,
    );

    const req = createRequest({ strava_access_token: "token" }, "?limit=10");
    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(1);
    expect(body[0].type).toBe("Run");
    expect(body[0].name).toBe("Run 1");

    expect(stravaService.getRecentActivities).toHaveBeenCalledWith(
      "valid_token",
      10,
    );
  });

  it("should set new cookies if token refreshed", async () => {
    const newTokens: any = {
      access_token: "new_access",
      refresh_token: "new_refresh",
      expires_in: 3600,
      expires_at: 1234567890,
    };

    vi.mocked(stravaService.getValidAccessToken).mockResolvedValue({
      accessToken: "new_access",
      newTokens: newTokens,
    });

    vi.mocked(stravaService.getRecentActivities).mockResolvedValue([]);

    const req = createRequest({ strava_refresh_token: "old_refresh" });
    const res = await GET(req);

    expect(res.status).toBe(200);

    const cookies = res.cookies.getAll();
    expect(cookies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "strava_access_token",
          value: "new_access",
        }),
        expect.objectContaining({
          name: "strava_refresh_token",
          value: "new_refresh",
        }),
        expect.objectContaining({ name: "strava_token_expires_at" }),
      ]),
    );
  });

  it("should handle service errors gracefully", async () => {
    vi.mocked(stravaService.getValidAccessToken).mockRejectedValue(
      new Error("Service Error"),
    );

    const req = createRequest();
    const res = await GET(req);

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body).toEqual({ error: "Internal server error" });
  });
});
