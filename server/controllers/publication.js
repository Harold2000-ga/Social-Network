const testPublication = (req, res) => {
    res.status(200).send({
        message: 'Messages from publication.js',
    })
}

module.exports = { testPublication }
