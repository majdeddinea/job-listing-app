import React, { useState } from "react";

const JobCard = ({ job }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getSkillsString = (skills) => {
    return skills.map((skill) => skill.name).join(", ");
  };

  const startDate = job.ranges_date?.[0]?.value_min
    ? new Date(job.ranges_date[0].value_min).toLocaleDateString()
    : "Not specified";

  const categoryTag = job.tags?.find(
    (tag) => tag.name.toLowerCase() === "category"
  );
  const category = categoryTag ? categoryTag.value : "Unknown";

  const companyTag = job.tags?.find(
    (tag) => tag.name.toLowerCase() === "company"
  );
  const company = companyTag ? companyTag.value : "Unknown";

  return (
    <div
      className={`job-card transition-shadow duration-300 ease-in-out p-4 my-2 bg-white rounded-lg shadow-sm hover:shadow-lg ${
        isExpanded ? "expanded" : ""
      }`}
      onClick={toggleExpand}
    >
      <h2 className="text-xl font-bold text-gray-800">{job.name}</h2>
      <p className="text-sm text-gray-500">
        Created at: {new Date(job.created_at).toLocaleDateString()}
      </p>
      {isExpanded && (
        <div className="mt-3 space-y-2">
          <div>
            <h3 className="font-semibold text-gray-700">Description:</h3>
            <p className="text-gray-600 text-sm">{job.summary}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700">Skills:</h3>
            <p className="text-gray-600 text-sm">
              {getSkillsString(job.skills)}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700">Start Date:</h3>
            <p className="text-gray-600 text-sm">{startDate}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700">Category:</h3>
            <p className="text-gray-600 text-sm">{category}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700">Company:</h3>
            <p className="text-gray-600 text-sm">{company}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;
