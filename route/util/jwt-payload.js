const payload = user => {
    return {
        _id: user._id, 
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        isAdmin: user.isAdmin
    };
}

module.exports = payload;