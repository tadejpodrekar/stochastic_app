const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
	const token = req.headers['x-access-token']
	if (!token)
	{
		return res.sendStatus(401)
	}
	else
	{
		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if(err)
			{
				console.log(err, 'e-authT')
				return res.sendStatus(403)
			}
			req.user = decoded.user
			next()
		})
	}
}

module.exports = authenticateToken