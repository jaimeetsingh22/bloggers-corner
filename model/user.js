const { createHmac, randomBytes } = require("crypto"); // createHmac ka use karke hum password ko hash karenge matlb ki encrypt karenge password ko
const { Schema, model } = require("mongoose");
const { createTokenForUser } = require("../services/authenticate");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"], // isse ye hota hai ki isme sirf do hi value reh sakta hai admin ya to user
      default: "USER",
    },
  },
  { timestamps: true }
);

// so ye userSchema.pre() function kar ye raha hai ki user ka given password ko database me save karne se pehle use hash code me change kar raha using the salt taki password safe rahe

// user ka data save hone se pehle ye wala function chalega
userSchema.pre("save", function (next) {
  // humne arrow function isliye use nhi kiya kyuki iska 'this' keyword global object ko point karta hai while normal function particular object ko point karta hai

  const user = this;

  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();

  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;

  next();
});

// so basically ye function ye karega ki jab user login karega to uske diye gaye email se use find kiya jayega and uske diye gaye password ko hash kiya jayega using that salt agr user hash kiya gaya password database ke hash kiya gaya password se match nhi kiya to user ne password galat diya hai

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await USER.findOne({ email });

    if (!user) throw new Error("User not found.");

    const salt = user.salt;
    const hashedInputPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (hashedInputPassword !== user.password) {
      // agar database ka password and user ka password enter kiya gaya password dono ka hash code match nahi kiya gaya to error show karega other wise login ho jayega
      throw new Error("Invalid Password!");
    }

    const token = createTokenForUser(user);

    return token;
  }
);

const USER = model("user", userSchema);

module.exports = USER;
