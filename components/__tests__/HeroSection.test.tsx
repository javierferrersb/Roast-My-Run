import { render, screen, fireEvent } from "@testing-library/react";
import { HeroSection } from "../HeroSection";
import { describe, it, expect, vi } from "vitest";

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock sub-components
vi.mock("../ActivitySelector", () => ({
  ActivitySelector: () => <div data-testid="activity-selector">Selector</div>,
}));
vi.mock("../ActivitySelectorSkeleton", () => ({
  ActivitySelectorSkeleton: () => <div data-testid="skeleton">Skeleton</div>,
}));
vi.mock("../ResultDisplay", () => ({
  ResultDisplay: () => <div data-testid="result-display">Result</div>,
}));

describe("HeroSection", () => {
  it("renders connect strava button when not signed in", () => {
    const onLogin = vi.fn();
    render(<HeroSection onStravaLogin={onLogin} />);

    expect(screen.getByText("about")).toBeInTheDocument();
    const loginBtn = screen.getByText("connectStrava");
    expect(loginBtn).toBeInTheDocument();

    fireEvent.click(loginBtn);
    expect(onLogin).toHaveBeenCalled();
  });

  it("renders skeleton when loading activities", () => {
    render(<HeroSection onStravaLogin={() => {}} isLoadingActivities={true} />);
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  it("renders activity selector when signed in (activities present)", () => {
    const activities: any[] = [{ id: 1, name: "Run" }];
    render(<HeroSection onStravaLogin={() => {}} activities={activities} />);
    expect(screen.getByTestId("activity-selector")).toBeInTheDocument();
  });

  it("renders result display when roast is present", () => {
    const activities: any[] = [{ id: 1, name: "Run" }];
    render(
      <HeroSection
        onStravaLogin={() => {}}
        activities={activities}
        roast="Bad run"
      />,
    );
    expect(screen.getByTestId("result-display")).toBeInTheDocument();
  });
});
