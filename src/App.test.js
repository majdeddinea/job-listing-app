import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";

import axiosMock from "axios-mock-adapter";
import axios from "axios";
import App from "./App";

describe("App Component", () => {
  const apiMock = new axiosMock(axios);
  const totalPages = 5;

  // Sample mock job data that includes all fields expected by JobCard
  const mockJobs = [
    {
      id: "1",
      name: "Software Engineer",
      created_at: "2021-01-01T00:00:00Z",
      summary: "Great job for a great engineer!",
      skills: [{ name: "JavaScript" }, { name: "React" }],
      tags: [
        { name: "category", value: "Engineering" },
        { name: "company", value: "TechCorp" },
      ],
      ranges_date: [{ value_min: "2021-06-01T00:00:00Z" }],
    },
  ];

  beforeEach(() => {
    apiMock.reset();
    localStorage.clear();
  });

  it("renders without crashing", () => {
    const { getByText } = render(<App />);
    expect(getByText("Loading jobs...")).toBeInTheDocument();
  });

  it("displays error when fetch fails", async () => {
    apiMock.onGet().networkError();
    const { getByText } = render(<App />);
    await waitFor(() => {
      expect(
        getByText("Failed to fetch jobs. Please try again later.")
      ).toBeInTheDocument();
    });
  });

  it("successfully fetches and renders jobs", async () => {
    apiMock.onGet().reply(200, {
      data: { jobs: mockJobs },
      meta: { maxPage: 1 },
    });

    const { getByText } = render(<App />);
    await waitFor(() => {
      mockJobs.forEach((job) => {
        expect(getByText(job.name)).toBeInTheDocument();
      });
    });
  });

  it("expands and collapses job details on click", async () => {
    apiMock.onGet().reply(200, {
      data: { jobs: mockJobs },
      meta: { maxPage: 1 },
    });

    render(<App />);

    // Wait for the mock job to be displayed and click to expand
    const jobTitle = await screen.findByText("Software Engineer");
    fireEvent.click(jobTitle);

    // Check that the job details are now visible
    expect(await screen.findByText("Description:")).toBeInTheDocument();

    fireEvent.click(jobTitle);

    // Assert that details are not visible after collapsing
    await waitFor(() => {
      expect(
        screen.queryByText("Great job for a great engineer!")
      ).not.toBeInTheDocument();
    });

    // If the text changes after expanding/collapsing and you need to click again,
    const jobTitleAgain = await screen.findByText("Software Engineer");
    fireEvent.click(jobTitleAgain);

    // Check that the details are visible again
    expect(await screen.findByText("Description:")).toBeInTheDocument();
  });

  it("changes page when pagination is used", async () => {
    apiMock.onGet().reply(200, {
      data: { jobs: [mockJobs[0]] },
      meta: { maxPage: totalPages },
    });

    const { getByText, getByLabelText } = render(<App />);
    await waitFor(() => {
      expect(getByText("Software Engineer")).toBeInTheDocument();
    });

    apiMock.onGet().reply(200, {
      data: { jobs: [{ id: "2", name: "Product Manager" }] },
      meta: { maxPage: totalPages },
    });

    const nextButton = getByLabelText("Go to next page");
    fireEvent.click(nextButton);

    await waitFor(() => {
      // Verify that the page changes and the new content is rendered
      expect(getByText("Product Manager")).toBeInTheDocument();
    });
  });

  beforeEach(() => {
    apiMock.reset();
    apiMock.onGet().reply(200, {
      data: { jobs: [{ id: "1", name: "Developer" }] },
      meta: { maxPage: totalPages },
    });
  });

  it("renders with correct page information using Pagination", async () => {
    const { getByText } = render(<App />);
    await waitFor(() => {
      expect(getByText("Page 1 of 5")).toBeInTheDocument();
    });
  });

  it("disables the Next button on the last page using Pagination", async () => {
    apiMock.onGet().reply(200, {
      data: { jobs: [{ id: "5", name: "Senior Developer" }] },
      meta: { maxPage: totalPages },
    });

    const { getByLabelText, getByText, debug } = render(<App />);
    await waitFor(() => {
      expect(getByText("Senior Developer")).toBeInTheDocument();
    });

    // Simulate the user navigating to the last page
    let nextButton = getByLabelText("Go to next page");
    while (!nextButton.disabled) {
      fireEvent.click(nextButton);
      await waitFor(() => {
        nextButton = getByLabelText("Go to next page");
      });
    }
    expect(nextButton).toBeDisabled();
  });
});
