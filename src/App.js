import Header from "./components/Header";
import Footer from "./components/Footer";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import About from "./components/About";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useState, useEffect } from "react";

function App() {
  const [showAddTaskPanel, setShowAddTaskPanel] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTaks();
      console.log("tasksFromServer ==>", tasksFromServer);
      setTasks(tasksFromServer);
    };

    getTasks();
  }, []);

  // Fetch tasks from server
  const fetchTaks = async () => {
    const res = await fetch("http://localhost:5000/tasks");
    const data = await res.json();

    console.log("Data ==>", data);
    return data;
  };

  // Fetch single task from server
  const fetchTak = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`);
    const data = await res.json();

    console.log("Single task ==>", data);
    return data;
  };

  const addTask = async (task) => {
    console.log("==>", task);
    const newTask = { text: task.task, ...task };

    const res = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });

    const data = await res.json();
    setTasks([...tasks, data]);

    // const latestTask = tasks[tasks.length - 1]
    // const newId = latestTask.id + 1;
    // const newTask = {id: newId, text: task.task, ...task}
    // setTasks([...tasks, newTask])
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
    });
    console.log("delete task", id);
    setTasks(tasks.filter((task) => task.id != id));
  };

  const toggleReminder = async (id) => {
    console.log("toggle remind:", id);
    const taskToToggle = await fetchTak(id);
    const updatedTask = { ...taskToToggle, reminder: !taskToToggle.reminder };

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });

    const data = await res.json();

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: data.reminder } : task
      )
    );
  };

  return (
    <Router>
      <div className="container">
        <Header
          title="Task tracker"
          onAdd={() => setShowAddTaskPanel(!showAddTaskPanel)}
          showAdd={showAddTaskPanel}
        />

        <Route
          path="/"
          exact
          render={(props) => (
            <>
              {showAddTaskPanel && <AddTask onAdd={addTask} />}
              {tasks.length > 0 ? (
                <Tasks
                  tasks={tasks}
                  onDelete={deleteTask}
                  onToggle={toggleReminder}
                />
              ) : (
                "No tasks to show!"
              )}
            </>
          )}
        />
        <Route path="/about" component={About} />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
