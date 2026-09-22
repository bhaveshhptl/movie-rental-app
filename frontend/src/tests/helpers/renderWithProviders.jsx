import { render } from "@testing-library/react";

// Components don't need providers (they're dumb), but pages often do.
// This wrapper is intentionally minimal.
export const renderWithProviders = (ui, options) => render(ui, options);