
import React, { useState, useContext } from "react";
import { AppContext } from './AppContext';
import './style.css';
function Taskgen() {
  const { tasklist, dispatch, loading } = useContext(AppContext);
  const [tasks, setTasks] = useState([]);
function generateDivs(startDate, endDate,percent){
  const divs = [];
  for (let i = 0; i < 10; i++) {
    if(i >= startDate && i<=endDate){
    if(i<(((endDate - startDate) * percent/100)+startDate)){
      divs.push(<td bgcolor="red" key={i}>----</td>);
    } else {
      divs.push(<td bgcolor="green" key={i}>----</td>);
    }
    } else {
      divs.push(<td key={i}>----</td>);
    }
  }
  return divs;
  }
  
  function handleSubmit(e) {
    e.preventDefault();

    let task = document.getElementById('taskAdd').value;
    let time = document.getElementById('time').value;
    let stdate = document.getElementById('stdate').value;
    let preid = document.getElementById('preid').value;
    preid = preid.split(',').map(Number);
    let ot = document.getElementById('ot').value;
    let pt = document.getElementById('pt').value;
    let mt = document.getElementById('mt').value;
    let perc = document.getElementById('perc').value;
    let id = 0;
    try{
      id = 1+tasklist[tasklist.length-1].id;
    } catch(error) {
      id =0;
    }
    const newTask = {
      id: id,
      text: task.trim(),
      time: time,
      stdate: stdate,
      preid : preid,
      ot : ot,
      pt : pt,
      mt : mt,
      perc : perc,
      completed: false,
    };
    if (newTask.text.length > 0) {
      const postData = async () => {
        try {
          const response = await fetch('http://localhost:5000/task', {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
          });
          const data = await response.json();
          console.log('Response:', data);
        } catch (error) {
          console.error('Error:', error);
          console.log('Response:', error.response);
          alert(error);
        }
      };
      postData();
      dispatch({
        type: 'ADD_TASK',
        payload: newTask,
      });
      setTasks([...tasks].concat(newTask));
    } else {
      alert("Enter Valid Task");
    }
    document.getElementById('taskAdd').value = "";
    document.getElementById('time').value = "";
    document.getElementById('stdate').value = "";
    document.getElementById('preid').value = "";
  }

  return (
    <div>
      <div id="todo-list">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id='taskAdd'
            placeholder="Enter your task here"
          />
          <input
            type="number"
            id="time"
            placeholder="Enter the time length"
          />
          <input
            type="number"
            id="stdate"
            placeholder="Enter the start date"
          />
          
          <input
            type="text"
            id="preid"
            placeholder="Preceeding tasks"
          />
          <input
            type="number"
            id="ot"
            placeholder="Enter opt time"
          />
          <input
            type="number"
            id="pt"
            placeholder="Enter pes time"
          />
          <input
            type="number"
            id="mt"
            placeholder="Enter most likely time"
          />
          <input
            type="number"
            id="perc"
            placeholder="Enter completion percentage"
          />
          <button type="submit">Add Task</button>
        </form>
        <table style={{border:'1px solid black'}}>
        <tr>
          <th>id</th>
          <th>Task</th>
          <th>St.Date</th>
          <th>Length</th>
          <th>Preceeding tasks</th>
          <th>Completion perc</th>
          <th>0</th>
          <th>1</th>
          <th>2</th>
          <th>3</th>
          <th>4</th>
          <th>5</th>
          <th>6</th>
          <th>7</th>
          <th>8</th>
          <th>9</th>
        </tr>
        {loading ? (
          <div>Loading...</div>
        ) : (
          
          tasklist.map((task) => (
            <tr key={task.id}>
              <td className="todo-id">{task.id}</td>
              <td className="todo-text">{task.text}</td>
              <td className="stdate">{task.stdate}</td>
              <td className="time-num">{task.time}</td>
              <td className="preid">{task.preid}</td>
              <td className="perc">{task.perc}</td>
              {generateDivs(Number(task.stdate),Number(task.time)+ Number(task.stdate),Number(task.perc))}
              {/* insert delete button below this line */}
            </tr>
          ))
        
        )}
        </table>
      </div>
    </div>
     );
}

export default Taskgen;