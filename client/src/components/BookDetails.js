import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { getBookQuery } from '../queries/queries';


class BookDetails extends Component {
    displayBookDetails() {
        const data = this.props.data.book;
        if (data) {
            return (
                <div>
                    <h2>{data.name}</h2>
                    <p>{data.genre}</p>
                    <p>{data.author.name}</p>
                    <p>All books by this author:</p>
                    <ul className="other-books">
                        {
                            data.author.books.map(item => <li key={item.id}>{item.name}</li>)
                        }
                    </ul>
                </div>
            );
        }

        return (<div> No book selected... </div>);

    }
    render() {
        return (
            <div id="book-details">
                {this.displayBookDetails()}
            </div>
        );
    }
}

export default graphql(getBookQuery, {
    options: (props) => {
        return {
            variables: {
                id: props.bookId
            }
        }
    }
})(BookDetails);