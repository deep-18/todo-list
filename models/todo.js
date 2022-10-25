var mongoose = require('mongoose');
var Schema = mongoose.Schema;

todoSchema = new Schema( {
	
	unique_id: Number,
	task: String,
	status: String,
}),
Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;