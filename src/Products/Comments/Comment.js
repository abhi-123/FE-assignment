import React from "react";
import "./Comment.css";
import InfiniteScroll from "react-infinite-scroll-component";


class Comments extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      comments : [],
      initialLoaded: false // Initial comment loaded value
      };
    }
    componentDidMount() {
        this.limit = this.props.skip || 0; // Setting initial limit
        // Initial comments fetch
        this.commentList();
      }

      commentList() { // Function to fetch comments
          this.limit += 5; // Incrementing comments limit
        let apiAccessToken;
        try {
          apiAccessToken = "8jl4oySoM4mU0Nm-yvqLAFG6l7ZuCVK8pn7aVuuYxvw";
        } catch (err) {
          apiAccessToken = "";
        }
    
        let uri = `https://api.producthunt.com/v1/posts/${this.props.id}/comments?per_page=${this.limit}`;
        
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
    
        async function commentData(url = "") {
          // Fetching Products Data
    
          const response = await fetch(req);
    
          return await response.json(); // parses JSON response into native JavaScript objects
        }
    
        commentData() // Function call for fetching comments
          .then(data => {
            // Response
            this.setState({ comments: data.comments, initialLoaded: true });
          });
      }
   
    render() {
        const commentsSection = this.state.comments.map((item, i) => (

    <div className = "comments" key={i}>
        <p>
            {item.body}
        </p>
</div>

        ));
        if(!this.state.initialLoaded)
        return (
            <div className="spinner-border fast mt-3" role="status" key='loader'>
            <span className="sr-only">Loading...</span>
          </div>
        )
        return (
            <div className = "commentSection" id="scrollableComments">
            <InfiniteScroll
            dataLength={this.state.comments.length}
            next={this.commentList.bind(this)}
            hasMore={this.limit < this.props.commentLength}
            loader={
                <div className="spinner-border spinner-border-sm fast" role="status" key='loader'>
            <span className="sr-only">Loading...</span>
          </div>
            }
                    endMessage={
            <p style={{textAlign: 'center'}}>
            <b>Yay! You have seen it all</b>
            </p>}
            scrollableTarget="scrollableComments"
          >
                {commentsSection}
                </InfiniteScroll>
            </div>

        )
    }
}
export default Comments;