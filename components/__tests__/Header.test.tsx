import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "../Header";
import { describe, it, expect, vi } from "vitest";

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock LanguageSwitcher
vi.mock("../LanguageSwitcher", () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher">Switcher</div>,
}));

describe("Header", () => {
  it("renders title and subtitle", () => {
    render(<Header />);
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("subtitle")).toBeInTheDocument();
  });

  it("renders Logout button when signed in", () => {
    const onLogout = vi.fn();
    render(<Header isSignedIn={true} onLogout={onLogout} />);

    const logoutBtn = screen.getByText("logout");
    expect(logoutBtn).toBeInTheDocument();

    fireEvent.click(logoutBtn);
    expect(onLogout).toHaveBeenCalled();
  });

  it("does not render Logout button when not signed in", () => {
    render(<Header isSignedIn={false} />);
    expect(screen.queryByText("logout")).not.toBeInTheDocument();
  });
});
