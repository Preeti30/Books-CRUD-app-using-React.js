
import React, { Component } from 'react'
import { FormGroup,Label,Input,Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import axios from 'axios'


class App extends Component {
  state = {
    books: [],
    newBookData:{
      title:'',
      rating:''
    },
    editBookData:{
      id:'',
      title:'',
      rating:''
    },
    newBookModal: false,
    editBookModal:false
  }

  componentDidMount() {
    this._refreshBooks()
  }

  toggleNewBookModal() {
    this.setState({
      newBookModal: ! this.state.newBookModal
    })
  }

  toggleEditBookModal() {
    this.setState({
      editBookModal: ! this.state.editBookModal
    })
  }

  addBook(){
    axios.post('http://localhost:3000/books/'+this.state.newBookData).then(
      (response)=>{
        //console.log(response.data)
        let {books} = this.state;
        books.push(response.data)
        this.setState({books, newBookModal:false,
          newBookData:{
            title:'',
            rating:''
          },
        })
      }
    )
  }

  updateBook(){
    let{title,rating} = this.state.editBookData
    axios.put('http://localhost:3000/books/'+this.state.editBookData.id,{
      title,rating
    }).then((response)=>
      //console.log(response.data)
      {
        //recall the server and upadte the list
        this._refreshBooks()
        this.setState({
          editBookModal:false, editBookData:{id:'', title:'',rating:''}
      });

  })
}
  editBook(id,title,rating){
    this.setState({
      editBookData:{id,title,rating},editBookModal: !this.state.editBookModal
    }) 
  }

  _refreshBooks(){
    axios.get('http://localhost:3000/books').then((response) => {
      this.setState({
        books: response.data
      })
    })
  }

  deleteBook(id){
    axios.delete('http://localhost:3000/books/'+id).then(
      (response)=>{this._refreshBooks()}
    )
  }
  render() {
    let books = this.state.books.map((book) => {
      return (
        <tr key={book.id}>
          <td>{book.id}</td>
          <td>{book.title}</td>
          <td>{book.rating}</td>
          <td>
            <Button color="success" size="sm" onClick={this.editBook.bind(this,book.id,book.title,book.rating)}>Edit</Button>
            <Button color="danger" size="sm" className="ml-3" onClick={this.deleteBook.bind(this,book.id)}>Delete</Button>
          </td>
        </tr>
      )
    })
    return (
      <div className="App containeer">
        <h1 className="text-center">Books Store</h1>
        <Button className="my-3" color="primary" onClick={this.toggleNewBookModal.bind(this)}>Add Book</Button>
        <Modal isOpen={this.state.newBookModal} toggle={this.toggleNewBookModal.bind(this)} >
          <ModalHeader toggle={this.toggleNewBookModal.bind(this)}>Add a new book</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="title">Title</Label>
              <Input type="title"  value={this.state.newBookData.title} onChange={
                (e)=>{
                  let {newBookData}= this.state;
                  newBookData.title = e.target.value
                  this.setState({newBookData})
                }
              }/>
            </FormGroup>

            <FormGroup>
              <Label for="rating">Rating</Label>
              <Input type="rating"  value ={this.state.newBookData.rating} onChange={
                (e)=>{
                  let {newBookData}= this.state;
                  newBookData.rating = e.target.value
                  this.setState({newBookData})
                }
              }
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addBook.bind(this)}>Add Book</Button>{' '}
            <Button color="secondary" onClick={this.toggleNewBookModal.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.editBookModal} toggle={this.toggleEditBookModal.bind(this)} >
          <ModalHeader toggle={this.toggleEditBookModal.bind(this)}>Edit a book</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="title">Title</Label>
              <Input type="title"  value={this.state.editBookData.title} onChange={
                (e)=>{
                  let {editBookData}= this.state;
                  editBookData.title = e.target.value
                  this.setState({editBookData})
                }
              }/>
            </FormGroup>

            <FormGroup>
              <Label for="rating">Rating</Label>
              <Input type="rating"  value ={this.state.editBookData.rating} onChange={
                (e)=>{
                  let {editBookData}= this.state;
                  editBookData.rating = e.target.value
                  this.setState({editBookData})
                }
              }
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.updateBook.bind(this)}>Update Book</Button>{' '}
            <Button color="secondary" onClick={this.toggleEditBookModal.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {books}
          </tbody>


        </Table>
      </div>
    );
  }
}


export default App;
