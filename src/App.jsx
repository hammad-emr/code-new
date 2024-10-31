import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Suggestions from './Suggestions';


const App = () => {
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editId, setEditID] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestions = ["Hammad Hassan", "Umar Naeem", "Osman Naeem", "Ali Naeem", "Osama Afzal"];

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/comments?postId=1')
      .then(res => {
        setData(res.data); 
      })
      .catch(err => {
        console.log(err);
        toast.error('Failed to fetch comments!');
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editId === -1) {
      const newComment = { name, email, postId: 1 }; 
      axios.post('https://jsonplaceholder.typicode.com/comments', newComment)
        .then(res => {
          setData([...data, res.data]); 
          setName('');
          setEmail('');
          toast.success('Comment added successfully!');
        })
        .catch(err => {
          console.log(err);
          toast.error('Failed to add comment! Please check your input.');
        });
    } else {
      const updatedComment = { id: editId, name, email };
      axios.put(`https://jsonplaceholder.typicode.com/comments/${editId}`, updatedComment)
        .then(res => {
          setData(data.map(item => (item.id === editId ? res.data : item))); 
          setName('');
          setEmail('');
          setEditID(-1);
          setShowSuggestions(false);
          toast.success('Comment updated successfully!');
        })
        .catch(err => {
          console.log(err);
          toast.error('Failed to update comment! Please check your input.');
        });
    }
  };

  const handleEdit = (id) => {
    const commentToEdit = data.find(user => user.id === id);
    setEditID(id);
    setName(commentToEdit.name);
    setEmail(commentToEdit.email);
    setShowSuggestions(true);
    toast.info('Editing comment...');
  };

  const handleSuggestionSelect = (suggestion) => {
    setName(suggestion);
    setShowSuggestions(false);
  };

  const handleDelete = (id) => {
    axios.delete(`https://jsonplaceholder.typicode.com/comments/${id}`)
      .then(res => {
        setData(data.filter(user => user.id !== id));
        toast.success('Comment deleted successfully!');
      })
      .catch(err => {
        console.log(err);
        toast.error('Failed to delete comment!');
      });
  };

  return (
    <div className='container'>
      <ToastContainer />
      <div className='form-div'>
        <form onSubmit={handleSubmit}>
          <input 
            type='text' 
            placeholder='Enter name' 
            value={name} 
            onChange={e => setName(e.target.value)} 
          />
          <input 
            type='text' 
            placeholder='Enter email' 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
          <button>{editId === -1 ? 'Add' : 'Update'}</button>
        </form>
      </div>
      {showSuggestions && (
        <Suggestions 
          suggestions={suggestions} 
          onSelect={handleSuggestionSelect} 
          onClose={() => setShowSuggestions(false)} 
        />
      )}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            data.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleEdit(user.id)}>Edit</button>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

export default App;
