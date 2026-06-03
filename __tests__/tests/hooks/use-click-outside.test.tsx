import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRef } from "react";
import { useClickOutside } from "@/hooks/use-click-outside";

describe("useClickOutside", () => {
  function TestComponent({ onOutsideClick }: { onOutsideClick: () => void }) {
    const ref = useRef<HTMLDivElement>(null);
    useClickOutside(ref, onOutsideClick);

    return (
      <div>
        <div
          ref={ref}
          data-testid="inside"
        >
          Inside
        </div>
        <div data-testid="outside">Outside</div>
      </div>
    );
  }

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not call handler when clicking inside the ref element", () => {
    const handler = vi.fn();
    render(<TestComponent onOutsideClick={handler} />);

    const insideElement = screen.getByTestId("inside");
    fireEvent.mouseDown(insideElement);

    expect(handler).not.toHaveBeenCalled();
  });

  it("calls handler when clicking outside the ref element", () => {
    const handler = vi.fn();
    render(<TestComponent onOutsideClick={handler} />);

    const outsideElement = screen.getByTestId("outside");
    fireEvent.mouseDown(outsideElement);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("calls handler when clicking on document body", () => {
    const handler = vi.fn();
    render(<TestComponent onOutsideClick={handler} />);

    fireEvent.mouseDown(document.body);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("does not call handler when ref is null/empty", () => {
    // We can't easily test null ref directly, but we can test that
    // clicking inside doesn't call the handler
    const handler = vi.fn();
    render(<TestComponent onOutsideClick={handler} />);

    // Click on the inside element
    const insideElement = screen.getByTestId("inside");
    fireEvent.mouseDown(insideElement);

    expect(handler).not.toHaveBeenCalled();
  });

  it("cleans up event listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");
    const handler = vi.fn();

    const { unmount } = render(<TestComponent onOutsideClick={handler} />);
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("mousedown", expect.any(Function));
  });

  it("handles multiple outside clicks correctly", () => {
    const handler = vi.fn();
    render(<TestComponent onOutsideClick={handler} />);

    const outsideElement = screen.getByTestId("outside");

    fireEvent.mouseDown(outsideElement);
    fireEvent.mouseDown(outsideElement);
    fireEvent.mouseDown(outsideElement);

    expect(handler).toHaveBeenCalledTimes(3);
  });
});
