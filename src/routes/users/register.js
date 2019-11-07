const User = require('../../models').User;

module.exports = async function(req, res) {
  const { email, password, username } = req.body;

  const doesUserExist = await User.findOne({ email });

  if (!doesUserExist) {
    const newUser = new User({ email, password, username });

    await newUser.encryptPassword(password);

    const user = await newUser.save();

    if (user) {
      const accessToken = user.generateAccessToken();

      return res.status(200).json({ accessToken });
    } else {
      return res.status(500).json({ message: 'Error was occured!' });
    }
  } else {
    return res.status(401).json({ message: 'User with such email is already exist!' });
  }
};
