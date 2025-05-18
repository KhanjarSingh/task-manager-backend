import Task from "../models/taskModel.js"


export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id })
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}// it basically finds all the tasks for the logged in user


export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" })
    }
    res.json(task)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
// here it fetches the task by some specififc id

export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, category, priority } = req.body

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      dueDate,
      category,
      priority,
      status: "pending",
    })

    res.status(201).json(task)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
} //Create a new task in the database and asssociate a user.id with it to specify

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" })
    }
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    res.json(updatedTask)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}//it updates the task of a user by the reference id 


export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }


    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" })
    }

    await Task.findByIdAndDelete(req.params.id)

    res.json({ message: "Task removed" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
// used to delete a specific task shown on ui