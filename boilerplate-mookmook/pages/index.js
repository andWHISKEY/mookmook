/* eslint-disable react/no-array-index-key */
import React from "react";
import Router from "next/router";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "../components/layout";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: null,
      movies: null,
      isLoading: true,
      type: null,
    };
  }

  componentDidMount() {
    this.postUploading();
  }

  postUploading = async () => {
    console.log("loading");
    const books = [];
    const movies = [];

    await Promise.all(
      ["book", "movie"].map(async (name) => {
        const docs = await this.getPosts(name);
        docs.forEach((doc) => {
          const data = doc.data();
          data.docID = doc.id;
          if (name === "book") books.push(data);
          else if (name === "movie") movies.push(data);
        });
      })
    );
    this.changeLoading(movies, books);
  };
  
  getPosts = (name) => {
    return new Promise((resolve, reject) => {
      const data = firebase.firestore().collection(name).get();
      resolve(data);
    });
  };

  changeLoading = (movies, books) => {
    if (books !== [] && movies !== []) {
      this.setState({ movies, books, isLoading: false });
    }
  };

  displayPosts = (props) => {
    const { type, movies, books } = props;
    if (movies || books) {
      return type
        ? books.map((book, index) => (
          // eslint-disable-next-line react/button-has-type
          <button key={index} onClick={() => Router.push(`/post/book_${book.docID}`)}>
            <img
              width="200px"
              height="150px"
              src={book.imgurl}
              alt={book.title}
            />
          </button>
        ))
        : movies.map((movie, index) => (
          // eslint-disable-next-line react/button-has-type
          <button key={index} onClick={() => Router.push(`/post/movie_${movie.docID}`)}>
            <img
              width="200px"
              height="150px"
              src={movie.imgurl}
              alt={movie.title}
            />
          </button>
        ));
    }
    return "Error";
  }

  checkChange = (type) => this.setState({ type });

  render() {
    console.log("rendering");
    const { isLoading, type, movies, books } = this.state;

    return (
      <div>
        <Layout />
        <Form.Check
          type="radio"
          name="type"
          label="movie"
          onChange={() => this.checkChange(false)}
          defaultChecked
        />
        <Form.Check
          type="radio"
          name="type"
          label="book"
          onChange={() => this.checkChange(true)}
        />
        { isLoading 
          ? "loading . . ."
          : this.displayPosts({type, movies, books})
          // : <DisplayPosts type={type} movies={movies} books={books} />
        }
      </div>
    );
  }
}

export default Home;
