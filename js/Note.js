var Note = React.createClass({
    getInitialState: function() {
        return {editing: false}
    },
    // Before the note being rendered, give it a randome tilt feeling.
    componentWillMount: function() {
        this.style = {
            right: this.randomBetween(0, window.innerWidth - 150) + 'px',
            top: this.randomBetween(0, window.innerHeight - 150) + 'px',
            transform: 'rotate(' + this.randomBetween(-15, 15) + 'deg)'
        };
    },
    // After the note being rendered by React, make it draggable using jQuery
    componentDidMount: function(){
        $(this.getDOMNode()).draggable();
    },
    // Helper function for generating a random position for the note and tilt degree
    randomBetween: function(min, max) {
        return (min + Math.ceil(Math.random() * max));
    },
    edit: function() {
        this.setState({editing: true});
    },
    save: function() {
        this.props.onChange(this.refs.newText.getDOMNode().value, this.props.index);
        this.setState({editing: false});
    },
    remove: function() {
        this.props.onRemove(this.props.index);
    },
    // Renders the read mode view
    renderDisplay: function() {
        return (
            <div className="note"
                style={this.style}>
                <p>{this.props.children}</p>
                <span>
                    <button onClick={this.edit}
                            className="btn btn-primary glyphicon glyphicon-pencil"/>
                    <button onClick={this.remove}
                            className="btn btn-danger glyphicon glyphicon-trash"/>
                </span>
            </div>
            );
    },
    // Renders the edit mode view
    renderForm: function() {
        return (
            <div className="note" style={this.style}>
            <textarea ref="newText" defaultValue={this.props.children} 
            className="form-control"></textarea>
            <button onClick={this.save} className="btn btn-success btn-sm glyphicon glyphicon-floppy-disk" />
            </div>
            )
    },
    render: function() {
        if (this.state.editing) {
            return this.renderForm();
        }
        else {
            return this.renderDisplay();
        }
    }
});

var Board = React.createClass({
    // Default property validation check
    propTypes: {
        count: function(props, propName) {
            if (typeof props[propName] !== "number"){
                return new Error('The count property must be a number');
            }
            if (props[propName] > 100) {
                return new Error("Having " + props[propName] + " notes on the board, really?...");
            }
        }
    },
    getInitialState: function() {
        return {
            notes: []
        };
    },
    // Assign an unique ID for the note
    nextId: function() {
        this.uniqueId = this.uniqueId || 0;
        return this.uniqueId++;
    },
    // Preparing some initial notes to display
    componentWillMount: function() {
        var self = this;
        var initialNoteNumber = this.props.count;
        if (initialNoteNumber) {
            for (var i = 0; i < initialNoteNumber; i++) {
                self.add("I'm a sticky note...");
            };
        }
    },
    add: function(text) {
        var arr = this.state.notes;
        arr.push({
            id: this.nextId(),
            note: text
        });
        this.setState({notes: arr});
    },
    update: function(newText, i) {
        var arr = this.state.notes;
        arr[i].note = newText;
        this.setState({notes:arr});
    },
    remove: function(i) {
        var arr = this.state.notes;
        arr.splice(i, 1);
        this.setState({notes: arr});
    },
    // Preparing each Note component with props and event handlers
    eachNote: function(note, i) {
        return (
                <Note key={note.id}
                    index={i}
                    onChange={this.update}
                    onRemove={this.remove}
                >{note.note}</Note>
            );
    },
    render: function() {
        return (<div className="board">
                    {this.state.notes.map(this.eachNote)}
                    <button className="btn btn-sm btn-success glyphicon glyphicon-plus"
                            onClick={this.add.bind(null, "New Note")}/>
            </div>

        );
    }
});


React.render(<Board count={12}/>, 
    document.getElementById('react-container'));










