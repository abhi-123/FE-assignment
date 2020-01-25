import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faThumbsUp} from "@fortawesome/free-regular-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Product.css";
import moment from "moment";
import Comment from './Comments/Comment'
class Products extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [], // Initial state
      startDate: null,
      loading: true,
    };
  }
  handleChange = date => {
    // Function on date change
    this.setState({
      startDate: date,
      loading: true
    });
    this.ProductList(date); // Fetching posts with date filter
  };
  showComment = i => { // Toggling comment panel
    let productsCopy = JSON.parse(JSON.stringify(this.state.products))
    productsCopy[i].showComment = !productsCopy[i].showComment
    this.setState({
        products:productsCopy 
     }) 
  }
  likePost = i => { // Toggling like button
    let productsCopy = JSON.parse(JSON.stringify(this.state.products))
    productsCopy[i].showLike = !productsCopy[i].showLike 
    this.setState({
        products:productsCopy 
     }) 
  }

  componentDidMount() {
    // Initial products fetch
    this.ProductList();
  }

  ProductList(date) {
    // Get Products
    let apiAccessToken;
    try {
      apiAccessToken = "8jl4oySoM4mU0Nm-yvqLAFG6l7ZuCVK8pn7aVuuYxvw";
    } catch (err) {
      apiAccessToken = "";
    }

    let uri = "https://api.producthunt.com/v1/posts";
    if (date)
      // Appending date if available
      uri += `?day=${moment(date).format('YYYY-MM-DD')}`;

    let h = new Headers(); // Appending Headers
    h.append("Authorization", "Bearer " + apiAccessToken);
    h.append("Content-Type", "application/json");
    h.append("Host", "api.producthunt.com");
    h.append("Accept", "application/json");

    let req = new Request(uri, {
      // Creating Request
      method: "GET",
      headers: h,
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer" // no-referrer, *client
    });

    async function postData(url = "") {
      // Fetching Products Data

      const response = await fetch(req);

      return await response.json(); // parses JSON response into native JavaScript objects
    }

    postData() // Function call for fetching posts
      .then(data => {
        // Response
        console.log(data);
        this.setState({ products: data.posts, loading: false });
      });
  }

  render() {
    // Rendering DOM

    // Common header
    let headerElement = [
      <div className="row" key='header'>
        <div className="col-sm-12 header">
          <div className="row">
            <div className="col-sm-6">
              <div className="navbar">
                <a className="active" href="#">
                  {" "}
                  Home
                </a>
                <a href="#">
                  <i className="fa fa-fw fa-search"></i> Search
                </a>
                <a href="#">
                  <i className="fa fa-fw fa-envelope"></i> Contact
                </a>
                <a href="#">
                  <i className="fa fa-fw fa-user"></i> Login
                </a>
              </div>
            </div>
            <div className="col-sm-6 pull-right">
              <DatePicker
                className="datePickerInput form-control"
                selected={this.state.startDate}
                onChange={this.handleChange}
                maxDate={new Date()}
                placeholderText="Select a date"
              />
            </div>
          </div>
        </div>
      </div>
    ];

    if (this.state.loading) {
      // Show Loader
      headerElement.push(
        <div className="spinner-border mt-3" role="status" key='loader'>
          <span className="sr-only">Loading...</span>
        </div>
      );
      return <div className="container-fluid">{headerElement}</div>;
    }    
    // Posts formation
    const products = this.state.products.map((item, i) => (
      <div className="row" key={i}>
        <div className="col-lg-6 offset-3">
          <div className="card" key={i}>
            <div className="card-body media">
              <a className="pull-left" href="#">
                <img
                  className="media-object"
                  src={item.thumbnail ? item.thumbnail.image_url : ""}
                ></img>
              </a>
              <div className="media-body">
                <h4 className="media-heading">{item.name}</h4>
                <p>{item.tagline}</p>
                <ul className="list-inline list-unstyled">
                  <li className="list-inline-item">
                    <span className= "likeButton cp">
                    <FontAwesomeIcon icon={faThumbsUp} className={`${this.state.products[i].showLike ? 'highlight' : '' }`} onClick={this.likePost.bind(this, i)}/> {item.votes_count>0 ? item.votes_count : null}{" "}
                    </span>
                  </li>
                 <li className="list-inline-item">|</li>
                 <span className={`commentButton cp ${this.state.products[i].showComment ? 'highlight' : ''}`} onClick={this.showComment.bind(this, i)}>
                  <FontAwesomeIcon icon={faComments} /> {item.comments_count} comments
                  </span>
                </ul>
                <input className="form-control postComment" type = "text" placeholder="Post a comment..."></input>
                {this.state.products[i].showComment && item.comments_count>0 && (<Comment id = {this.state.products[i].id} skip={0} commentLength = {item.comments_count}/>)}
                </div>
              </div>
            </div>
          </div>
        </div>

    ));

    return (
      <div className="container-fluid paddingZero">
        {headerElement}
        <div className="col-sm-12 containerMain">{products}</div>
      </div>
    );
  }
}
export default Products;
