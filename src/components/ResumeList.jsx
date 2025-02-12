import React, { useEffect, useState, useContext } from "react";
import { getResume, deleteResume } from "../services/resumeService";
import ResumeForm from "./ResumeForm";
import { AuthContext } from "../context/AuthContext";


const ResumeList = () => {
    
  const { user } = useContext(AuthContext);
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);

  const fetchResumes = async () => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }
    try {
      const resume = await getResume(user.id);
      setResumes(Array.isArray(resume) ? resume : [resume]);
      setSelectedResume(null);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      try {
        await deleteResume(id);
        fetchResumes();
      } catch (error) {
        console.error("Error deleting resume:", error);
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchResumes();
    }
  }, [user]);
  
  return (
    <div>
      {Array.isArray(resumes) && resumes.length > 0 ? (
        resumes.map((resume) => (
          resume._id ? (
            <div key={resume._id} className="resume-card">
              <img
                src={`http://localhost:5000/${resume.profileImage}`}
                alt={resume.name}
                className="profile-image"
              />
              <h2>{resume.name}</h2>
              <p><strong>Email:</strong> {resume.email}</p>
              <p><strong>Skills:</strong> {resume.skills.join(", ")}</p>
              <p><strong>Experience:</strong> {resume.experience}</p>
              <p><strong>Education:</strong> {resume.education}</p>
              <button onClick={() => setSelectedResume(resume)}>Edit</button>
              <button onClick={() => handleDelete(resume._id)}>Delete</button>
            </div>
            
          ) : null
        ))
      ) : (
        <p>No resumes found</p>
      )}
      
      {selectedResume && <ResumeForm resume={selectedResume} onSave={fetchResumes} />}
    </div>
  );
};

export default ResumeList;
