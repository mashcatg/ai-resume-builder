import React, { useEffect } from "react";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import AIGenerate from "./AIGenerate";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  skills: yup.string().required("Skills are required"),
  experience: yup.string().required("Experience is required"),
  education: yup.string().required("Education is required"),
  summary: yup.string().required("Summary is required"),
});

const ResumeForm = ({ resume, onSave }) => {
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const [profileImage, setProfileImage] = useState(null);
  const [aiSummary, setAiSummary] = useState("");

  useEffect(() => {
    if (resume) {
      setValue("name", resume.name);
      setValue("email", resume.email);
      setValue("skills", resume.skills.join(", "));
      setValue("experience", resume.experience);
      setValue("education", resume.education);
      setValue("summary", resume.summary);
      setAiSummary(resume.aiSummary);
    }
  }, [resume, setValue]);

  const onSubmit = async (data) => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }
    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("skills", data.skills.split(",").map(skill => skill.trim()));
    formData.append("experience", data.experience);
    formData.append("education", data.education);
    formData.append("summary", data.summary);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }
    try {
      if (resume && resume._id) {
        await api.put(`/resume/${resume._id}`, formData);
      } else {
        await api.post("/resume/create", formData);
      }
      onSave();
    } catch (error) {
      console.error("Error saving resume:", error);
    }
  };

  const handleGenerateAI = async () => {
    try {
      // Save the resume first
      await handleSubmit(onSubmit)();

      // Send the saved resume data to AI
      const response = await api.post("/ai/generate", {
        name: resume.name,
        email: resume.email,
        skills: resume.skills,
        experience: resume.experience,
        education: resume.education,
        summary: resume.summary,
      });

      // Update the resume with the AI response
      await api.put(`/resume/${resume._id}`, { aiSummary: response.data.improvedText });
      setAiSummary(response.data.improvedText);
    } catch (error) {
      console.error("Error generating AI content:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" {...register("name")} placeholder="Name" />
      {errors.name && <span>{errors.name.message}</span>}
      <input type="email" {...register("email")} placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}
      <textarea {...register("skills")} placeholder="Skills" />
      {errors.skills && <span>{errors.skills.message}</span>}
      <textarea {...register("experience")} placeholder="Experience" />
      {errors.experience && <span>{errors.experience.message}</span>}
      <textarea {...register("education")} placeholder="Education" />
      {errors.education && <span>{errors.education.message}</span>}
      <textarea {...register("summary")} placeholder="Summary" />
      {errors.summary && <span>{errors.summary.message}</span>}
      <textarea value={aiSummary} onChange={(e) => setAiSummary(e.target.value)} placeholder="AI Summary" />
      <input type="file" onChange={(e) => setProfileImage(e.target.files[0])} />
      <button type="submit">Save</button>
      <button type="button" onClick={handleGenerateAI}>Generate by AI</button>
    </form>
  );
};

export default ResumeForm;
