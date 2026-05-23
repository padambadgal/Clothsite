import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { verifyEmail } from "../emailVerify/verifyEmail.js";
import { Session } from "../models/Session.js";
import cloudinary from 'cloudinary'
import { sendOTPMail } from '../emailVerify/sendOTPMail.js'
export const register = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    const { firstName, lastName, email, password } = req.body;

    // ✅ validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ check existing user
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ create user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    // ✅ FIX: don't overwrite jwt
    const token = jwt.sign(
      { id: newUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    // ✅ send email
    await verifyEmail(token, email);

    // ✅ save token
    newUser.token = token;
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const verify = async (req, res) => {
  try {
    const token = req.query.token
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token not found"
      })
    }
    let decoded
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY)
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(400).json({
          success: false,
          message: "The registration token has expired"
        })
      }
      return res.status(400).json({
        success: false,
        message: "Token Verification Failed"
      })
    }
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      })
    }
    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: "Email already verified"
      })
    }
    user.token = null
    user.isVerified = true
    await user.save()
    return res.status(200).json({
      success: true,
      message: "Email verified Successfully"
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const reVerify = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      })
    }
    const token = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: '1d' }
    )
    await verifyEmail(token, email)
    user.token = token
    await user.save()
    return res.status(200).json({
      success: true,
      message: "✅ Verification email sent successfully",
      token: user.token
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    // ✅ find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // ✅ check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // ✅ check if user is verified
    if (user.isVerified === false) {
      return res.status(400).json({
        success: false,
        message:
          "Please verify your email address before logging in. Check your inbox for the verification link.",
      });
    }

    // ✅ generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: '10d' }
    )

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    user.isLoggedIn = true
    await user.save();

    const existingSession = await Session.findOne({ userId: user._id })
    if (existingSession) {
      await Session.deleteOne({ userId: user._id })
    }

    await Session.create({ userId: user._id, })// ✅ send response   user})
    return res.status(200).json({
      success: true,
      message:
        `Welcome back ${user.firstName}`,
      user: user,
      // {
      //   id: user._id,
      //   firstName: user.firstName,
      //   lastName: user.lastName,
      //   email: user.email,
      //   isLoggedIn: user.isLoggedIn
      // },
      token,
      refreshToken
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.id
    await Session.deleteMany({ userId: userId })
    await User.findByIdAndUpdate(userId, { isLoggedIn: false })
    return res.status(200).json({
      success: true,
      message: 'User logged out successfully'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      })
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) //10mins
    user.otp = otp
    user.otpExpiry = otpExpiry

    await user.save()
    await sendOTPMail(otp, email)
    return res.status(200).json({
      success: true,
      message: 'Otp send yo email successfully'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.params.email
    if (!otp) {
      return res.status(400).json({
        success: false,
        message: 'Otp is required'
      })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      })
    }
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: 'otp is not generated or verified'
      })
    }
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Otp has expired Please request a new one'
      })
    }
    if (otp !== user.otp) {
      return res.status(400).json({
        success: false,
        message: 'Otp is invalid'
      })
    }
    user.otp = null
    user.otpExpiry = null

    await user.save()
    return res.status(200).json({
      success: true,
      message: 'Otp verified Successfully'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const changePassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body
    const { email } = req.params
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      })
    }
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All field are required'
      })
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password do not match'
      })
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    await user.save()
    return res.status(200).json({
      success: true,
      message: 'Password change Successfully'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }

}

export const addAddress = async (req, res) => {
  try {
    const userId = req.id
    const { fullName, phone, email, address, city, state, zip, country } = req.body
    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    user.addresses.push({ fullName, phone, email, address, city, state, zip, country })
    await user.save()
    return res.status(200).json({ success: true, message: 'Address added', addresses: user.addresses })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const getAddresses = async (req, res) => {
  try {
    const userId = req.id
    const user = await User.findById(userId).select('addresses')
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    return res.status(200).json({ success: true, addresses: user.addresses })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const allUser = async (req, res) => {
  try {
    const users = await User.find()
    return res.status(200).json({
      success: true,
      users
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password -otp -otpExpiry -token')
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }
    return res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const updateUser = async (req, res) => {
  try {
    const userIdUpdate = req.params.id;
    const loggedInUser = req.user;
    const { firstName,
      lastName,
      address,
      city,
      zipCode,
      phoneNo,
      role } = req.body;


    if (loggedInUser._id.toString() !== userIdUpdate && loggedInUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this profile"
      })
    }
    let user = await User.findById(userIdUpdate)
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      })
    }

    let profilePicUrl = user.profilePic;
    let profilePicPublicId = user.profilePicPublicId;

    if (req.file) {
      if (profilePicPublicId) {
        await cloudinary.uploader.destroy(profilePicPublicId)
      }
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: 'profiles' }, (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
        )
        stream.end(req.file.buffer)
      })

      profilePicUrl = uploadResult.secure_url;
      profilePicPublicId = uploadResult.public_id
    }

    //update fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.address = address || user.address;
    user.city = city || user.city;
    user.zipCode = zipCode || user.zipCode;
    user.phoneNo = phoneNo || user.phoneNo;
    user.role = role;
    user.profilePic = profilePicUrl;
    user.profilePicPublicId = profilePicPublicId;

    const updatedUser = await user.save()

    return res.status(200).json({
      success: true,
      message: 'profile updated SuccessFully',
      user: updatedUser
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}