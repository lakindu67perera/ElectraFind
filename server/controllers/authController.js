const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const pool = require("../db");
// const queries = require("./queries");

const filterObj = (obj, ...allowedFeilds)=>{
    const newObj = {};
    Object.keys(obj).forEach((el)=>{
        if (allowedFeilds.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

const signToken = (id)=>{
    return jwt.sign({id:id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);
    console.log("not password");
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      // secure:req.secure || req.headers('x-forwarded-proto')==="https"
 };
 // if (process.env.NODE_ENV === "production") cookieOptions.secure = true
  // if (req.secure) cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};



// const signup = (req,res)=>{
//   const { name, email, password_hash, phone, role } = req.body;
//     //check if the email exist
//     pool.query(queries.checkEmailExists, [email], (error, results) => {
//         if (results.rows.length) {
//             res.send("Email already exists.");
//         }
//         pool.query(queries.addUser, [name, email, password_hash, phone, role], (error, results) => {
//             if (error) throw error;
//             res.status(201).send("User created successfully!");
//         })
//     })
// };

const login = async(req,res)=>{
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

};

exports.signup = catchAsync(async (req, res, next) => {

  const filteredBody = filterObj(
    req.body,
    "name",
    "email",
    "password",
    "passwordConfirm"
  );
  const newUser = await User.create(filteredBody);
  
  const otp = `${Math.floor(Math.random() * 90000)}`;
  const verification= await Verification.create({code:otp,user:newUser});
  const url = `${process.env.CLIENT_ORIGIN}/verifycode/${newUser._id}/${otp}`;

// send email with otp
console.log("send email with otp",otp)


  newUser.password = undefined;
  res.status(201).json({
    status: "success",
    data: {
      newUser,
    },
  });

  // createSendToken(newUser, 201,req, res);
});

module.exports ={
  signup,
  login,
}