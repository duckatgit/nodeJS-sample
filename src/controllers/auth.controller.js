const bcrypt = require("bcrypt")
const userModel = require("../models/user.model");
const Nominee = require("../models/nominee.model")
const generateOTP = require("../utils/generateOtp")
const sendEmail = require("../utils/sendEmail")
const sendMessage = require("../utils/sendMessage")
const generateRandomHexColor = require("../utils/generateRandomColor")
const jwt = require("jsonwebtoken")


const checkUserExistence = async (req, res) => {
    const { emailorphone } = req.body;

    try {

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^\+[1-9]{1}[0-9]{1,3}[0-9]{10}$/;

        const isEmail = emailRegex.test(emailorphone);
        const isPhone = phoneRegex.test(emailorphone);

        if (!isEmail && !isPhone) {
            return res.status(400).json({
                status: 400,
                message: "Invalid email or phone number format"
            });
        }

        const checkForUser = await userModel.findOne({
            $or: [
                { email: emailorphone },
                { phone: emailorphone }
            ]
        })

        if (checkForUser) {
            return res.status(400).json({
                status: 400,
                message: "User already exists"
            });
        }

        return res.status(200).json({
            message: "New user found",
            status: 200
        })
    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: "An error occurred while checking user existence",
            error: err.message
        });
    }
}

const createUserAccount = async (req, res) => {
    try {
        const { first_name, last_name, email, phone } = req.body;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^\+[1-9]{1}[0-9]{1,3}[0-9]{10}$/;

        const isEmail = emailRegex.test(email);
        const isPhone = phoneRegex.test(phone);

        if (!isEmail || !isPhone) {
            return res.status(400).json({
                status: 400,
                message: "Invalid email or phone number format"
            });
        }

        const checkForUser = await userModel.findOne({
            $or: [
                { email: email },
                { phone: phone }
            ]
        })

        if (checkForUser) {
            return res.status(400).json({
                status: 400,
                message: "User already exists"
            });
        }

        const otp_for_email = generateOTP()
        const otp_for_phone = generateOTP()


        const createAccount = await userModel.create({
            first_name,
            last_name,
            email,
            phone,
            otp: otp_for_email.toString() + otp_for_phone.toString()
        })


        sendEmail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "OTP for Crux App",
            text: "OTP for Crux App",
            html: `OTP: ${otp_for_email}`,
        })

        sendMessage(phone, `OTP: ${otp_for_phone}`)

        return res.status(200).json({
            status: 200,
            message: "Please verify your email and phone",
            data: createAccount
        })

    }
    catch (err) {
        return res.json(400).json({
            status: 400,
            message: err.message
        })
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const otpRegex = /^\d{6}$/;

        const isEmail = emailRegex.test(email);
        const isOtp = otpRegex.test(otp)

        if (!isEmail) {
            return res.status(400).json({
                status: 400,
                message: "Invalid email format"
            });
        }

        if (!isOtp) {
            return res.status(400).json({
                status: 400,
                message: "Please fill the complete OTP"
            });
        }

        const checkForUser = await userModel.findOne({
            email: email,
        })

        if (!checkForUser) {
            return res.status(400).json({
                status: 400,
                message: "User doesn't exist"
            });
        }

        if (checkForUser?.otp == "0") {
            return res.status(400).json({
                status: 400,
                message: "You are already verified."
            })
        }

        const checkForOtp = await userModel.findOne({
            email: email,
            otp: otp
        })

        if (!checkForOtp) {
            return res.status(400).json({
                status: 400,
                message: "OTP didn't match"
            })
        }

        await userModel.findOneAndUpdate({
            email: email
        }, {
            otp: "0",
            verified: true
        })

        // const createBucketFunc = await createBucket(`bucket-${checkForOtp?._id.toString()}`)

        // await Bucket.create({
        //     user_id: checkForOtp?._id,
        //     bucket_name: createBucketFunc
        // })

        return res.status(200).json({
            status: 200,
            message: "User verified successfully"
        })
    } catch (err) {
        return res.json(400).json({
            status: 400,
            message: err.message
        })
    }
}

const addNominee = async (req, res) => {
    try {
        const { user_id, name, role, email } = req.body;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        const isEmail = emailRegex.test(email);

        if (!isEmail) {
            return res.status(400).json({
                status: 400,
                message: "Invalid email format"
            });
        }

        const roleenum = ["Spouse", "Civil Partner", "Girlfriend", "Boyfriend", "Daughter", "Son",
            "Father", "Mother", "Sister", "Brother", "Friend", "Father in law", "Mother in law", "Sister in law", "Brother in law", "Lawyer", "Doctor"];


        if (!roleenum?.includes(role)) {
            return res.status(400).json({
                status: 400,
                message: "Role is not correct"
            });
        }

        const checkForUser = await userModel.findOne({
            _id: user_id
        })

        if (!checkForUser) {
            return res.status(400).json({
                status: 400,
                message: "User doesn't exist"
            });
        }

        if (checkForUser?.email == email) {
            return res.status(400).json({
                status: 400,
                message: "You can't invite yourself as a nominee"
            });
        }

        const checkForNominee = await Nominee.findOne({
            user_id: user_id,
            email: email
        })


        if (checkForNominee) {
            return res.status(400).json({
                status: 400,
                message: "Nominee already invited."
            })
        }

        let color = generateRandomHexColor()

        const addNominee = await Nominee.create({
            user_id,
            name,
            role,
            email,
            background_color: color.darkColor,
            role_color: color.lightColor
        })

        // const findBucket = await Bucket.findOne({
        //     user_id: user_id
        // })

        // const createFolderFunc = await createFolder(findBucket?.bucket_name, `${name}`)

        // await Folders.create({
        //     user_id: user_id,
        //     bucket_id: findBucket?._id,
        //     nominee_id: addNominee?._id,
        //     folder_name: createFolderFunc
        // })

        const findUser = await userModel.findOne({
            _id: user_id
        })


        sendEmail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Invitation to crux app as nominee",
            text: "Invitation to crux app as nominee",
            html: `You have been invited by ${findUser?.first_name + " " + findUser?.last_name} in the crux app as a nominee.`,
        })

        return res.status(200).json({
            message: "Nominee has been invited",
            status: 200,
            data: addNominee
        })
    } catch (err) {
        return res.json(400).json({
            status: 400,
            message: err.message
        })
    }
}

const removeNominee = async (req, res) => {
    try {
        const { id, user_id } = req.params;

        const checkForNominee = await Nominee.findOne({
            _id: id,
            user_id: user_id
        })

        if (!checkForNominee) {
            return res.status(400).json({
                status: 400,
                message: "Nominee doesn't exist"
            });
        }

        await Nominee.findOneAndDelete({
            _id: id
        })

        // const checkBucketFolderData = await Folders.findOne({
        //     nominee_id: id
        // }).populate('bucket_id')

        // console.log('checkBucketFolderData', checkBucketFolderData)

        // await deleteFolder(checkBucketFolderData?.bucket_id?.bucket_name, checkBucketFolderData?.folder_name)

        // await Folders.findOneAndDelete({
        //     _id: checkBucketFolderData?._id
        // })

        return res.status(200).json({
            status: 200,
            message: "Nominee has been removed"
        })

    } catch (err) {
        return res.json(400).json({
            status: 400,
            message: err.message
        })
    }
}

const listNominee = async (req, res) => {
    try {
        const { user_id } = req?.params;


        const checkForUser = await userModel.findOne({
            _id: user_id
        })

        if (!checkForUser) {
            return res.status(400).json({
                status: 400,
                message: "User doesn't exist"
            });
        }

        const listNominee = await Nominee.find({
            user_id: user_id
        })

        return res.status(200).json({
            status: 200,
            message: "Nominees fetched successfully",
            data: listNominee
        })


    } catch (err) {
        return res.json(400).json({
            status: 400,
            message: err.message
        })
    }
}

const addPassword = async (req, res) => {
    try {
        const { user_id, password } = req.body;

        const checkForUser = await userModel.findOne({
            _id: user_id
        })

        if (!checkForUser) {
            return res.status(400).json({
                status: 400,
                message: "User doesn't exist"
            });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        if (checkForUser?.password) {
            return res.status(400).json({
                status: 400,
                message: "password already exists"
            })
        }

        await userModel.findOneAndUpdate({
            _id: user_id
        }, {
            password: hashedPassword
        })


        return res.status(200).json({
            message: "password has been added",
            status: 200
        })

    } catch (err) {
        return res.json(400).json({
            status: 400,
            message: err.message
        })
    }
}

const signInUser = async (req, res) => {
    try {
        const { emailorphone, password } = req.body;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^\+[1-9]{1}[0-9]{1,3}[0-9]{10}$/;

        const isEmail = emailRegex.test(emailorphone);
        const isPhone = phoneRegex.test(emailorphone);

        if (!isEmail && !isPhone) {
            return res.status(400).json({
                status: 400,
                message: "Invalid email or phone number format"
            });
        }

        const checkForUser = await userModel.findOne({
            $or: [
                { email: emailorphone },
                { phone: emailorphone }
            ]
        })

        if (!checkForUser) {
            return res.status(400).json({
                status: 400,
                message: "User doesn't exist"
            });
        }

        const checkForPassword = bcrypt.compareSync(password, checkForUser?.password);

        if (!checkForPassword) {
            return res.status(400).json({
                status: 400,
                message: "Password doesn't match. Please add the correct password"
            })
        }

        const accessToken = jwt.sign({ data: checkForUser }, process.env.SECRET);

        let userData = {
            first_name: checkForUser?.first_name,
            last_name: checkForUser?.last_name,
            email: checkForUser?.email,
            phone: checkForUser?.phone,
            createdAt: checkForUser?.createdAt,
            updatedAt: checkForUser?.updatedAt,
            accessToken: accessToken
        }

        return res.status(200).json({
            status: 200,
            message: "User signed in successfully",
            data: userData
        })
    } catch (err) {
        return res.json(400).json({
            status: 400,
            message: err.message
        })
    }
}

const forgetPassword = async (req, res) => {
    try {
        const { email, phone } = req.body;

        if (!email && !phone) {
            return res.status(400).json({
                status: 400,
                message: "Please fill the required fields"
            })
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^\+[1-9]{1}[0-9]{1,3}[0-9]{10}$/;

        const isEmail = emailRegex.test(email);
        const isPhone = phoneRegex.test(phone);

        if (!isEmail && !isPhone) {
            return res.status(400).json({
                status: 400,
                message: "Invalid email or phone number format"
            });
        }

        if (email && phone) {
            return res.status(400).json({
                status: 400,
                message: "Please choose either email or phone"
            })
        }

        const checkForUser = await userModel.findOne({
            $or: [
                { email: email },
                { phone: phone }
            ]
        })

        if (!checkForUser) {
            return res.status(400).json({
                status: 400,
                message: "User doesn't exist"
            });
        }

        let encryptEmail;
        let createdLink;

        if (email) {
            encryptEmail = btoa(email);
            createdLink = `${process.env.FRONTEND_URL}/web/reset-password?token=${encryptEmail}`
            sendEmail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Reset Password Link",
                text: "Reset Password Link",
                html: `Reset Password Link: ${createdLink}`,
            })
        }
        else if (phone) {
            encryptEmail = btoa(phone);
            createdLink = `${process.env.FRONTEND_URL}/web/reset-password?token=${encryptEmail}`
            sendMessage(phone, `Reset Password Link: ${createdLink}`)
        }

        await userModel.findOneAndUpdate({
            _id: checkForUser?._id
        }, {
            resetPasswordToken: encryptEmail
        }
        )

        return res.status(200).json({
            status: 200,
            message: "Password reset link has been sent successfully"
        })
    } catch (err) {
        return res.json(400).json({
            status: 400,
            message: err.message
        })
    }
}

const resetForgotPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        const decryptToken = atob(token);

        const checkForUser = await userModel.findOne({
            $or: [
                { email: decryptToken },
                { phone: decryptToken }
            ],
        })

        if (!checkForUser) {
            return res.status(400).json({
                status: 400,
                message: "User doesn't exist"
            });
        }

        if (!checkForUser?.resetPasswordToken) {
            return res.status(400).json({
                status: 400,
                message: "Reset Password token expired. Please request again for password reset"
            });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        await userModel.findOneAndUpdate({
            _id: checkForUser?._id
        }, {
            password: hashedPassword,
            resetPasswordToken: 0
        })


        return res.status(200).json({
            status: 200,
            message: "Password reset successfully"
        })


    } catch (err) {
        return res.json(400).json({
            status: 400,
            message: err.message
        })
    }
}


module.exports = {
    checkUserExistence,
    createUserAccount,
    verifyOtp,
    addNominee,
    addPassword,
    listNominee,
    signInUser,
    forgetPassword,
    resetForgotPassword,
    removeNominee
}