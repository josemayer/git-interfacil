/* eslint-disable no-undef */
const { drawLine, drawCommit } = require("../src/canvasController.js");

jest.mock("../src/canvasController.js");
const ctxMock = jest.fn();

describe("renderer", () => {
  beforeEach(() => jest.clearAllMocks());
  it("should not render if no canvas", () => {
    document.querySelector = jest.fn();
    try {
      require("../src/renderer.js");
      expect(true).toBe(false); // Above line should throw error
    } catch (e) {
      expect(e.message).toBe("No canvas found");
    }
  });

  it("should not render if no canvas's 2d context", () => {
    document.querySelector = () => ({ getContext: () => null });
    try {
      require("../src/renderer.js");
      expect(true).toBe(false); // Above line should throw error
    } catch (e) {
      expect(e.message).toBe("No 2d context found");
    }
  });

  it("should render correctly", () => {
    document.querySelector = () => ({ getContext: () => ctxMock });
    require("../src/renderer.js");

    expect(drawCommit).toHaveBeenCalledTimes(14);
    expect(drawLine).toHaveBeenCalledTimes(14);
  });
});
