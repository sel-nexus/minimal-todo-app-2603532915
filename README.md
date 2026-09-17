# Minimal Todo App

A deliberately small, direct-browser todo fixture for validating an end-to-end test pipeline. It uses one `index.html` file containing all HTML, CSS, and vanilla JavaScript. There is no backend, database, dependency, storage, or persistence in the browser artifact.

## Run

Open `index.html` directly in a modern browser. The initial list is empty on every page load.

## Behavior contract

- Add a trimmed task with **Add** or the Enter key.
- Blank and whitespace-only submissions do nothing.
- Task IDs start at `1` and increment in add order.
- Toggle a checkbox to apply or remove line-through styling.
- Delete removes only that task; an empty list displays `No tasks yet.`.
- Stable `id` and `data-testid` selectors are provided for automated tests.

## Browser test

The only development dependency is Playwright, used to test the live standalone page. Install dependencies, then execute:

```sh
npm install --no-bin-links
node node_modules/@playwright/test/cli.js install chromium
node node_modules/@playwright/test/cli.js test --config playwright.config.ts
```

The test starts a local static server only for browser automation. The production artifact itself remains directly openable as `index.html`.

## License

Private and proprietary.
