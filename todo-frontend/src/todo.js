import { useEffect, useState } from "react";

export default function Todo() {
const [title,setTitle]= useState("")
const [description, setDescription] = useState("");
const [todos,setTodos] = useState([])
const [error, setError] = useState('');
const [message, setMessage] = useState("");
const [editId, setEditId] = useState(-1);
 //Edit
const [edittitle, setEditTitle] = useState("");
 const [editdescription, setEditDescription] = useState("");

const apiUrl = "http://localhost:8000";

const handleSubmit = () =>{
  setError("")
  //Check Input
if (title.trim()!==''&& description.trim()!==''){

fetch(apiUrl+"/todos",{
    method:'POST',
    headers:{
        'Content-Type':"application/json"
    },
    body:JSON.stringify({title,description})
}) .then((res)=>{
if (res.ok) {
  //add item to list
  setTodos([...todos, { title, description }]);
  setTitle("");
  setDescription("");
  setMessage("Item Added Successfully");
  setTimeout(()=>{
    setMessage('')
  },3000)
}else{
    //set error
setError("Unable Todo item")
}

  
}).catch(()=>{
  setError("Unable Todo item");
})

}
}

useEffect (()=>{
  getItems()
})

const getItems = ()=>{
  fetch(apiUrl+"/todos")
  .then((res)=>res.json())
  .then((res)=>{
    setTodos(res)
  })
}

const handleEdit = (item)=>{
  setEditId(item._id);
  setEditTitle(item.title);
  setEditDescription(item.description);
}

const handleUpdate = ()=>{
  setError("");
  //Check Input
  if (edittitle.trim() !== "" && editdescription.trim() !== "") {
    fetch(apiUrl + "/todos/"+editId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title:edittitle, description:editdescription }),
    })
      .then((res) => {
        if (res.ok) {
          //Update item to list
       const updatedTodo =  todos.map((item)=>{
          if (item._id ==editId) {
            item.title = edittitle;
            item.description=editdescription;
          }
          return item;
         })


          setTodos(updatedTodo);
          setEditTitle("");
          setEditDescription("");
          setMessage("Item Updated Successfully");
          setTimeout(() => {
            setMessage("");
          }, 3000)
          setEditId(-1);
        } else {
          //set error
          setError("Unable Todo item");
        }
      })
      .catch(() => {
        setError("Unable Todo item");
      });
  }


}
const handleEditCancel = ()=>{
  setEditId(-1)
}

const handleDelete = (id)=>{
if (window.confirm("Are sure want to Delete?")) {
  fetch(apiUrl+'/todos/'+id,{
    method:"DELETE"
  }).then(()=>{
   const updatedTodos = todos.filter((item)=>item._id!==id)
   setTodos(updatedTodos)
  })

}
}



  return (
    <>
      <div className="row p-3 bg-success text-light text text-center">
        <h1>ToDo Project With MERN Stack </h1>
      </div>
      <div>
        <h3 className="text-center mt-3">Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        <div className="form-group d-flex gap-2 mt-3">
          <input
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="form-control"
            type="text"
          />
          <input
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="form-control"
            type="text"
          />
          <button className="btn btn-dark" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        {error && <p className="text-danger">{error}</p>}
      </div>
      <div className="row mt-4 justify-content-center">
        <h3 className="text-center">Tasks</h3>
        <div className="col-md-7 ">
          <ul className="list-group">
            {todos.map((item) => (
              <li className="list-group-item bg-info d-flex justify-content-between align-items-center my-2 ">
                <div className="d-flex flex-column me-2">
                  {editId == -1 || editId !== item._id ? (
                    <>
                      <span className="fw-bold">{item.title}</span>
                      <span>{item.description}</span>
                    </>
                  ) : (
                    <>
                      <div className="form-group d-flex gap-2">
                        <input
                          placeholder="Title"
                          onChange={(e) => setEditTitle(e.target.value)}
                          value={edittitle}
                          className="form-control"
                          type="text"
                        />
                        <input
                          placeholder="Description"
                          onChange={(e) => setEditDescription(e.target.value)}
                          value={editdescription}
                          className="form-control"
                          type="text"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="d-flex gap-2">
                  {editId == -1 ? (
                    <button
                      className="btn btn-warning"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                  ) : (
                    <button className="btn btn-warning" onClick={handleUpdate}>
                      Update
                    </button>
                  )}
                  {editId == -1 ? (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  ) : (
                    <button
                      className="btn btn-danger"
                      onClick={handleEditCancel}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
