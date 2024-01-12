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

export const fetchAllJobs = async (page, limit = 10) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/jobs/searching?board_keys=%5B%22${BOARD_KEY}%22%5D&page=${page}&limit=${limit}&order_by=desc`,
      {
        ...options,
      }
    );
    console.log(response.data.data.jobs);
    return response.data;
  } catch (err) {
    console.error("Error fetching jobs:", err);
    throw err;
  }
};
