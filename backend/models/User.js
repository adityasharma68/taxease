// ─── models/User.js ──────────────────────────────────────────────────────────
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name:     { type:String, required:[true,"Please provide your name"], trim:true },
  email:    { type:String, required:[true,"Please provide an email"], unique:true, lowercase:true, trim:true },
  password: { type:String, required:[true,"Please provide a password"], minlength:[6,"Password must be at least 6 characters"], select:false },
  phone:    { type:String, trim:true },
  role:     { type:String, enum:["client","admin","accountant"], default:"client" },
  pan:      { type:String, uppercase:true, trim:true },
  gstin:    { type:String, uppercase:true, trim:true },
  address:  { type:String, default:"" },
  city:     { type:String, default:"" },
  state:    { type:String, default:"" },
  pincode:  { type:String, default:"" },
  assignedAccountant: { type:mongoose.Schema.Types.ObjectId, ref:"User" },
  plan:     { type:String, enum:["Basic","Pro","Enterprise"], default:"Basic" },
  isActive: { type:Boolean, default:true },
  avatar:          { type:String, default:"" },
  avatarPublicId:  { type:String, default:"" },
}, { timestamps:true });

// Hash password before save (Mongoose 7+ — no next parameter)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
