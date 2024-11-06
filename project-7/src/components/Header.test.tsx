import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Header from "./Header";

describe("Header Component", () => {
    test("renders the 'Twitter' text correctly", () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        const twitterText = screen.getByText("Twitter");
        expect(twitterText).toBeInTheDocument();
    });

    test("navigates to the home page when the 'Twitter' link is clicked", async () => {
        render(
            <MemoryRouter initialEntries={['/some-other-page']}>
                <Header />
            </MemoryRouter>
        );

        const twitterLink = screen.getByText("Twitter");

        userEvent.click(twitterLink);

        expect(window.location.pathname).toBe("/");
    });

    test("renders without crashing", () => {
        const { container } = render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        expect(container).toBeInTheDocument();
    });
});
