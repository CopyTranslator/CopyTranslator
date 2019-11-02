const { testWithSpectron } = require("vue-cli-plugin-electron-builder");
jest.setTimeout(50000);

test("Window Loads Properly", async () => {
  // Wait for dev server to start
  const { app, stopServe } = await testWithSpectron();
  const win = app.browserWindow;
  const client = app.client;

  // Window was created
  expect(await client.getWindowCount()).toBe(1);
  // It is not minimized
  expect(await win.isMinimized()).toBe(false);
  // Window is visible
  expect(await win.isVisible()).toBe(true);
  // Size is correct
  const { width, height } = await win.getBounds();
  expect(width).toBeGreaterThan(0);
  expect(height).toBeGreaterThan(0);
  // App is loaded properly
  expect(
    /Welcome to Your Vue\.js (\+ TypeScript )?App/.test(
      await client.getHTML("#app")
    )
  ).toBe(true);

  await stopServe();
});
