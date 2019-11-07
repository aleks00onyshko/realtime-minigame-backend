const { User } = require('../../models');

module.exports = async function(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    if (await user.isPasswordValid(password)) {
      const accessToken = user.generateAccessToken();

      return res.status(200).json({ accessToken });
    } else {
      return res.status(500).json({ message: 'Wrong password!' });
    }
  } else {
    return res.status(404).json({ message: 'User with such email does not exist!' });
  }
};
