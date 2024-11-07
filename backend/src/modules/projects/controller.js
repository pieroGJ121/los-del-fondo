const mongoose = require('mongoose');
const { Project } = require('../../DB/mongodb');
const db = require('../../DB/mysql');

exports.createProject = async (req, res) => {
  try {
    const { userId, name, surname, status } = req.body;
    const userExists = await db.oneUser('users', userId);

    if(!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }
    const newProject = new Project({ userId, name, surname, status });
    await newProject.save();
    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (err) {
    res.status(500).json({ message: 'Error creating project', err });
  }
};

exports.getUserProjects = async (req, res) => {
  try {
    const { userId } = req.params;
    const projects = await Project.find({ userId });
    res.status(200).json({ projects });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving projects', err });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedProject = await Project.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedProject) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json({ message: 'Project updated successfully', project: updatedProject });
  } catch (err) {
    res.status(500).json({ message: 'Error updating project', err });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting project', err });
  }
};

exports.isProjectNested = async (req, res) => {
  try {
    const {parentProjectId, nestedProjectId} = req.params;
    const parentProject = await Project.findById(parentProjectId);
    if (!parentProject) return res.status(404).json({ message: 'Parent project not found' });

    const isNested = parentProject.nestedProjects.includes(nestedProjectId);
    res.status(200).json({ isNested });
  } catch (err) {
    res.status(500).json({ message: 'Error checking if project is nested', err });
  }
};

exports.checkProjectFiles = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId).populate('files');
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const hasFiles = project.files.length > 0;
    res.status(200).json({ hasFiles });
  } catch (err) {
    res.status(500).json({ message: 'Error checking project files', err });
  }
};
