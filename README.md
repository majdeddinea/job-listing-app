# Job Listing App

Welcome to the Job Listing App! This application allows you to browse through various job listings, filter them by category, sort them in different orders, and view detailed information about each job. Follow the instructions below to get started.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of [Node.js and npm](https://nodejs.org/en/).
- You have a Windows, Linux, or Mac machine.

## Installation

To install the Job Listing App, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://git@github.com:majdeddinea/job-listing-app.git
   ```

2. Navigate to the project directory:

   ```bash
   cd job-listing-app
   ```

3. Install the required npm packages:
   ```bash
   npm install
   ```

## Configuration

Set up your environment variables:

1. Create `.env` file.
2. Open the `.env` file and fill in the details:
   ```
   REACT_APP_HRFLOW_API_KEY=your_hrflow_api_key
   REACT_APP_BOARD_KEY=your_board_key
   REACT_APP_EMAIL_KEY=your_email
   ```

## Running the Application

To run the Job Listing App, follow these steps:

1. Start the development server:

   ```bash
   npm start
   ```

2. Open your web browser and navigate to [http://localhost:3000](http://localhost:3000).

## Using the App

Once the application is running, you can:

- **View Jobs**: Browse all available job listings.
- **Filter Jobs**: Use the category dropdown to filter jobs.
- **Search Jobs**: Find jobs by name using the search bar.
- **Sort Jobs**: Use the sort dropdown to order jobs by date, name, or category.
- **Drag and Drop**: Reorder jobs using drag-and-drop (disabled when a category filter other than 'All' is applied).
- **Expand Job Details**: Click on a job card to view detailed information about the position.
- **Reset Filters**: Clear all filters and searches with one click.

## Special Features

- **Drag-and-Drop Sorting**: You can reorder jobs by dragging and dropping. This feature is disabled when specific category filters are applied.
- **Sort Dropdown Control**: When drag-and-drop sorting is used, the sort dropdown is disabled. A tooltip appears on hover, indicating that filters need to be cleared to use the sort dropdown again.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AddFeature`)
3. Commit your Changes (`git commit -m 'Add some Feature'`)
4. Push to the Branch (`git push origin feature/AddFeature`)
5. Open a Pull Request

## Project Link

Explore the project here: [https://job-listing-fjz0x4vhu-majdeddinea1.vercel.app/](https://job-listing-fjz0x4vhu-majdeddinea1.vercel.app/)

---
