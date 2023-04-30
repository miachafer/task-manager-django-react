import React, {Component} from 'react'
import './App.css';
import CustomModal from './components/Modal';
import axios from 'axios';

// const tasks = [
//   {
//     id: 1,
//     title: "Blog writing",
//     description: "Theme: How to work less and earn more",
//     completed: false
//   },
//   {
//     id: 2,
//     title: "Pay bills",
//     description: "Pay rent and energy bills",
//     completed: true
//   }
// ]

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: false,
      viewCompleted: false,
      activeItem: {
        title: '',
        description: '',
        completed: false
      },
      // taskList: tasks
      todoList: []
    }
  }

  componentDidMount() {
    this.refreshList()
  }

  refreshList = () => {
    axios
      .get('http://localhost:8000/api/tasks/')
      .then(response => this.setState({ todoList: response.data }))
      .catch(error => console.log(error))
  }

  toggle = () => {
    this.setState({ modal: !this.state.modal })
  }

  handleSubmit = item => {
    this.toggle()
    // alert('Saved!', JSON.stringify(item))
    if(item.id) {
      axios
        .put(`http://localhost:8000/api/tasks/${item.id}/`, item)
        .then(res => this.refreshList())
    } else {
    axios
      .post('http://localhost:8000/api/tasks/', item)
      .then(res => this.refreshList())
    }
  }

  handleDelete = item => {
    // alert('Deleted!', JSON.stringify(item))
    axios
      .delete(`http://localhost:8000/api/tasks/${item.id}/`)
      .then(res => this.refreshList)
  }

  createItem = () => {
    const item = { title: '', description: '', completed: false }
    this.setState({ activeItem: item, modal: !this.state.modal })
  }

  editItem = item => {
    this.setState({ activeItem: item, modal: !this.state.modal })
  }

  displayCompleted = status => {
    if(status) {
      return this.setState({ viewCompleted: true})
    }
    return this.setState({ viewCompleted: false})
  }

  renderTabList = () => {
    return (
      <div className='my-5 tab-list'>
        <span
          onClick={() => this.displayCompleted(true)}
          className={this.state.viewCompleted ? 'active' : ''}
        >
          Completed       
        </span>
        <span
          onClick={() => this.displayCompleted(false)}
          className={this.state.viewCompleted ? '' : 'active'}
        >
          Incompleted       
        </span>
      </div>
    )
  }

  renderItems = () => {
    const { viewCompleted } = this.state
    const newItens = this.state.todoList.filter(
      item => item.completed === viewCompleted
    )
    return newItens.map(item => (
      <li 
        key={item.id}
        className='list-group-item d-flex justify-content-between align-items-center'>
          <span
            className={`todo-title mr-2 ${this.state.viewCompleted ? 'completed-todo' : ''}`}
            title = {item.title}
          >
            {item.title}
          </span>
          <span>
            <button 
              className='btn btn-warning mr-2' 
              onClick={() => this.editItem(item)}>
                Edit
            </button>
            <button 
              className='btn btn-danger mr-2' 
              onClick={() => this.handleDelete(item)}>
                Delete
            </button>
          </span>
      </li>
    ))
  }

  // This method renders the page
  render() {
    return(
      <main className='context'>
        <h1 className='text-black text-uppercase text-center my-4'>Task Manager</h1>
        <div className='row'>
          <div className='col-md-6 col-sma-10 mx-auto p-0'>
            <div className='card p-3'>
              <div>
                <button 
                  className='btn btn-primary'
                  onClick={this.createItem}
                  >Add task</button>
              </div>
              {this.renderTabList()}
              <ul className='list-group list-group-flush'>
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        <footer
          className='my-5 mb-2 text-black text-center'>
            Copyright 2023 &copy;
        </footer>
        {this.state.modal ? (
          <CustomModal 
            activeItem={this.state.activeItem} 
            toggle={this.toggle} 
            onSave={this.handleSubmit}/>
        ) : null}
      </main>
    )
  }
}

export default App;
