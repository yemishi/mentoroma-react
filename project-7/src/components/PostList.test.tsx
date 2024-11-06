import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import PostList from "./PostList";
import api from "../utils/api";
import { Post } from "../types/types";
import "@testing-library/jest-dom";
import { act } from "react-dom/test-utils";

jest.mock("../utils/api");

const mockPosts: Post[] = [
  {
    id: "1",
    title: "First Post",
    content: "This is the content of the first post.",
    starsCount: 0
  },
  {
    id: "2",
    title: "Second Post",
    content: "This is the content of the second post.",
    starsCount: 2
  },
];

describe("PostList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders posts correctly when API call is successful", async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockPosts });

    render(
      <BrowserRouter>
        <PostList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("First Post")).toBeInTheDocument();
      expect(screen.getByText("Second Post")).toBeInTheDocument();
    });

    expect(screen.getAllByText("View Details")).toHaveLength(mockPosts.length);
  });

  test("displays an error message when API call fails", async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error("Failed to fetch posts"))

    await act(async () => {
      render(
        <BrowserRouter>
          <PostList />
        </BrowserRouter>
      );
    })
    await new Promise((e) => {
      setTimeout(e, 1000)
    });

    expect(screen.getByText("Failed to fetch posts")).toBeInTheDocument();

  });
});
