/* eslint-disable no-undef */
const actionButtonsHandlers = require("../../../../src/screens/Repository/controllers/actionsController.js");
const Toast = require("../../../../src/components/Toast/toast.js");
const { ipcRenderer } = require("electron");

console.log = jest.fn();
console.error = jest.fn();

jest.mock("electron", () => ({
  ipcRenderer: {
    send: jest.fn(),
    once: jest.fn(),
    invoke: jest.fn(),
    // on: jest.fn(),
  },
}));

jest.mock("../../../../src/components/Toast/toast.js", () => ({
  showToast: jest.fn(),
}));

describe("actionsController", () => {
  let repoMock;

  beforeEach(() => {
    repoMock = {
      get_changed_files: jest.fn(),
      add_files: jest.fn(),
      commit: jest.fn(),
      push: jest.fn(),
    };
  });

  describe("add", () => {
    it("should show an error toast and invoke showErrorBox when no changes are detected", async () => {
      repoMock.get_changed_files.mockResolvedValue([""]);
      await actionButtonsHandlers.add(repoMock);
      expect(Toast.showToast).toHaveBeenCalledWith(
        "Error: add",
        "../assets/error-icon.svg",
      );
      expect(ipcRenderer.invoke).toHaveBeenCalledWith(
        "showErrorBox",
        "No changes detected",
      );
    });

    it("should add files and show a success toast when changes are detected", async () => {
      repoMock.get_changed_files.mockResolvedValue(["file1", "file2"]);
      await actionButtonsHandlers.add(repoMock);
      expect(repoMock.add_files).toHaveBeenCalledWith(["file1", "file2"]);
      expect(Toast.showToast).toHaveBeenCalledWith(
        "Done: add",
        "../assets/sucess-icon.svg",
      );
    });
  });

  describe("push", () => {
    it("should push changes to the remote repository and show a success toast", async () => {
      repoMock.push.mockResolvedValue();

      await actionButtonsHandlers.push(repoMock, "main");

      expect(repoMock.push).toHaveBeenCalledWith("origin", "main");
      expect(Toast.showToast).toHaveBeenCalledWith(
        "Done: push",
        "../assets/sucess-icon.svg",
      );
    });
  });
});
