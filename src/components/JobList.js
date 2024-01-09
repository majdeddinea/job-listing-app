import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import JobCard from "./JobCard";

const JobList = ({ jobs, onDragEnd, isDragAndDropDisabled }) => {
  console.log("Jobs in JobList:", jobs);
  return (
    <div className="space-y-3">
      <DragDropContext onDragEnd={isDragAndDropDisabled ? () => {} : onDragEnd}>
        <Droppable droppableId="jobsDroppable">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {jobs.map((job, index) => (
                <Draggable
                  key={job.id}
                  draggableId={String(job.id)}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <JobCard job={job} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default JobList;
