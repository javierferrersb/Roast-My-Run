import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("Example Test", () => {
  it("renders a heading", () => {
    render(
      <div>
        <h1>Hello World</h1>
      </div>,
    );
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Hello World");
  });
});
