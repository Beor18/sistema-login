var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	local: {
		username: {type: String, unique: true, require: true},
		password: {type: String, require: true},
		country: {type: String, require: true},
	},
});

userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

var User = mongoose.model('User', userSchema);
module.exports = User;
