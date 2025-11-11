const  mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userSchema =new Schema({

  email :{type: String,unique : true},
  password : String,
  firstname : String,
  lastnaame : String


});
const adminSchema =new Schema({

  email :{type: String,unique : true},
  password : String,
  firstname : String,
  lastnaame : String


});
const courseSchema =new  Schema({

  title : String,
  description : String,
  price : Number,
  imgurl : String,
  creatorId : ObjectId

});
const purchaseSchema =new  Schema({

  userId : ObjectId,
  courseId : ObjectId


});


const usermodel = mongoose.model("user",userSchema);
const adminmodel = mongoose.model("admin",adminSchema);
const coursemodel = mongoose.model("course",courseSchema);
const purchasemodel = mongoose.model("purchase",purchaseSchema);
module.exports={
usermodel,
  adminmodel,
  coursemodel,
  purchasemodel

}
