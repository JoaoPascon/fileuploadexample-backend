const routes = require('express').Router();
const multer = require('multer')
const multerConfig = require('./config/multer')
const PostModel = require('./models/Post')

routes.get('/', (req, res) => {
    return res.json({hello: 'World'});
})

routes.get('/posts', async (req, res) => {
    const posts = await PostModel.find();
    return res.json(posts);
})

routes.delete('/posts/:id', async(req, res) => {
    const postFound = await PostModel.findById(req.params.id);
    await postFound.remove();
    return res.send();
})

routes.post('/posts', multer(multerConfig).single('file'), async (req, res) => {
    
    const {orginalName: name, size, key, location: url = ''} = req.file;

    const post = await PostModel.create({
        name, size, key, url
    })

    return res.json(post);
})

module.exports = routes;