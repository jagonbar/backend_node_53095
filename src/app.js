/*
Consigna
* Desarrollar un servidor basado en express donde podamos hacer consultas a nuestro archivo de productos.

Aspectos a incluir

*Se deberá utilizar la clase ProductManager que actualmente utilizamos con persistencia de archivos. 
*Desarrollar un servidor express que, en su archivo app.js importe al archivo de ProductManager que actualmente tenemos.
*El servidor debe contar con los siguientes endpoints:
    *ruta ‘/products’, la cual debe leer el archivo de productos y devolverlos dentro de un objeto. 
        *Agregar el soporte para recibir por query param el valor ?limit= el cual recibirá un límite de resultados.
        *Si no se recibe query de límite, se devolverán todos los productos
        *Si se recibe un límite, sólo devolver el número de productos solicitados
    *ruta ‘/products/:pid’, la cual debe recibir por req.params el pid (product Id), y devolver sólo el producto solicitado, en lugar de todos los productos

*/
import express        from 'express'
import apiRouter      from './routes/apiRouter.js'
import upload         from './config/multer.js'
import {__dirname}    from './path.js'

const app  = express()
const port = 8080


app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(__dirname +'public'))

//Routes
app.use('/api',apiRouter)

//multer
app.post('/api/upload', upload.single('file'), (req, res)=>{
    try {
        console.log(req.file, req.body)
        res.status(200).send("imagen cargada")
    } catch (error) {
        console.log(error)
        res.status(500).send("error al cargar la imagen")
    }
})

app.get('/', (req, res) => {
    const msg = `rutas habilitadas:
    <li>GET '/api/products/'</li>
    <li>GET '/api/products/:pid'</li>
    <li>POST '/api/products/'</li>
    <li>PUT '/api/products/:pid'</li>
    <li>DELETE '/api/products/:pid'</li>
`
    res.send(msg)
})



/*************************************************************************************************** */
//Server
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
})
/*************************************************************************************************** */
/*************************************************************************************************** */
/*************************************************************************************************** */
/*************************************************************************************************** */
/*
import http from 'http'

//req = request = peticion
//res = response = respuesta
const app = http.createServer((req, res) => {
    res.end('Hello Worldasdf333') //mensaje en explorer
})

app.listen(8000, () => {
    console.log('Servidor corriendo en el puerto 8000xxddddxx')//mensaje en log terminal
})
*/