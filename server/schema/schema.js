const graphql = require('graphql');
const { GraphQLObjectType } = graphql;
const _ = require('lodash');
const Book = require('../models/book.model');
const Author = require('../models/author.model');

// var booksMock = [
//     { name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1' },
//     { name: 'The Final Emprire', genre: 'Fantasy', id: '2', authorId: '2' },
//     { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
//     { name: 'The Hero of Ages', genre: 'Fantasy', id: '4', authorId: '2' },
//     { name: 'The Colour of Magic', genre: 'Fantasy', id: '5', authorId: '3' },
//     { name: 'The Light Fantastic', genre: 'Fantasy', id: '6', authorId: '3' }
// ];

// var authorsMock = [
//     { name: 'Patrick Rothfuss', age: 44, id: '1' },
//     { name: 'Brandon Sanderson', age: 42, id: '2' },
//     { name: 'Terry Pratchett', age: 66, id: '3' }
// ];

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: graphql.GraphQLID },
        name: { type: graphql.GraphQLString },
        genre: { type: graphql.GraphQLString },
        //Relaciona o livro com os autores
        author: {
            type: AuthorType,
            resolve(parent, args) {
                // return _.find(authorsMock, {id: parent.authorId});
                return Author.findById(parent.authorId);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: graphql.GraphQLID, description: "Id of the entity" },
        name: { type: graphql.GraphQLString },
        age: { type: graphql.GraphQLInt },
        //Relaciona o autor com seus livros
        books: {
            type: new graphql.GraphQLList(BookType),
            resolve(parent, args) {
                // return _.filter(booksMock, { authorId: parent.id});
                return Book.find({ authorId: parent.id });
            }
        }
    })
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: graphql.GraphQLID } },
            resolve(parent, args) {
                //code to get data from db/ other source
                // return _.find(booksMock, { id: args.id });
                return Book.findById(args.id);
            }
        },
        books: {
            type: new graphql.GraphQLList(BookType),
            resolve() {
                // return booksMock;
                return Book.find({});
            }
        },

        author: {
            type: AuthorType,
            args: { id: { type: graphql.GraphQLID } },
            resolve(parent, args) {
                //code to get data from db/ other source
                // return _.find(authorsMock, { id: args.id });
                Author.findById(args.id);
            }
        },

        authors: {
            type: new graphql.GraphQLList(AuthorType),
            resolve(parent, args) {
                //code to get data from db/ other source
                // return authorsMock;
                return Author.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
                age: { type: graphql.GraphQLInt }
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age
                });

                return author.save();
            }
        },

        addBook: {
            type: BookType,
            args: {
                name: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
                genre: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
                authorId: { type: new graphql.GraphQLNonNull(graphql.GraphQLID) }
            },
            resolve(parent, args) {
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                })

                return book.save();
            }
        }
    }
});

module.exports = new graphql.GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});