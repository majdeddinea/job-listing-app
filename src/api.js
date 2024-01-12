import axios from "axios";

const API_KEY = process.env.REACT_APP_HRFLOW_API_KEY;
const BOARD_KEY = process.env.REACT_APP_BOARD_KEY;
const EMAIL_KEY = process.env.REACT_APP_EMAIL_KEY;
const BASE_URL = "https://api.hrflow.ai/v1";

const options = {
  headers: {
    accept: "application/json",
    "X-API-KEY": API_KEY,
    "X-USER-EMAIL": EMAIL_KEY,
  },
};

// CancelToken source defined outside the function
let cancelTokenSource = axios.CancelToken.source();

export const fetchAllJobs = async (page, limit = 10) => {
  // Cancel the previous request
  if (cancelTokenSource) {
    cancelTokenSource.cancel("Operation canceled due to new request.");
  }

  // Create a new CancelToken for the new request
  cancelTokenSource = axios.CancelToken.source();

  try {
    const response = await axios.get(
      `${BASE_URL}/jobs/searching?board_keys=%5B%22${BOARD_KEY}%22%5D&page=${page}&limit=${limit}&order_by=desc`,
      {
        ...options,
        cancelToken: cancelTokenSource.token,
      }
    );
    console.log(response.data.data.jobs);
    return response.data;
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log("Request canceled:", err.message);
    } else {
      console.error("Error fetching jobs:", err);
      throw err;
    }
  }
};
