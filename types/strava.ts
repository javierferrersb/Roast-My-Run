/**
 * Strava Activity Response Types
 * Reference: https://developers.strava.com/docs/reference/#api-Activities
 */

export interface StravaActivity {
  id: number;
  name: string;
  distance: number; // meters
  moving_time: number; // seconds
  total_elevation_gain: number; // meters
  average_heartrate?: number; // bpm (optional, depends on activity type)
  type: string; // 'Run', 'Ride', 'Swim', etc.
  start_date: string; // ISO 8601 format
  sport_type?: string;
}

export interface StravaAccessTokenResponse {
  token_type: string;
  expires_at: number; // Unix timestamp
  expires_in: number; // seconds
  refresh_token: string;
  access_token: string;
}
