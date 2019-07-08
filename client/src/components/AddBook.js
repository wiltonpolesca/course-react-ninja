import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { getAuthorsQuery, addBookMutation, getBooksQuery } from '../queries/queries';

class AddBook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            genre: '',
            authorId: ''
        };
    }

    displayAuthors() {
        var data = this.props.getAuthorsQuery;
        if (data.loading) {
            return (<option>Loading Authors ...</option>)
        }

        return data.authors.map(author => {
            return (<option key={author.id} value={author.id}> {author.name} </option>)
        });
    }

    submitForm(e) {
        //Evita a tela ser atualizada
        e.preventDefault();

        this.props.addBookMutation({
            variables: {
                name: this.state.name,
                genre: this.state.genre,
                authorId: this.state.authorId
            },
            refetchQueries:[{query: getBooksQuery}]
        });
    }

    render() {
        return (

            <form id="add-book" onSubmit={this.submitForm.bind(this)}>
                <div className="field">
                    <label>Book Name</label>
                    <input type="text" onChange={(e) => this.setState({ name: e.target.value })}></input>
                </div>

                <div className="field">
                    <label>Genre</label>
                    <input type="text" onChange={(e) => this.setState({ genre: e.target.value })}></input>
                </div>

                <div className="field">
                    <label>Author</label>
                    <select onChange={(e) => this.setState({ authorId: e.target.value })} >
                        <option>Selet author</option>
                        {this.displayAuthors()}
                    </select>

                    <button>+</button>
                </div>
            </form>
        );
    }
}

export default compose(
    graphql(getAuthorsQuery, { name: "getAuthorsQuery" }),
    graphql(addBookMutation, { name: "addBookMutation" })
)(AddBook);