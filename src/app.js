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
import express from 'express'
import ProductManager from './util/ProductManager.js'
import Validador from './util/Validador.js'
const app = express()
const port= 8080
const dataFile = './data/listaProductos.json'
const pm = new ProductManager(dataFile)

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    const msg = `rutas habilitadas:
    <li><strong>/products:</strong> listado de productos</li>
    <li><strong>/products/:pid:</strong> producto solicitado</li>`
    res.send(msg)
})
/*************************************************************************************************** */
/* /products */
app.get('/products', async (req, res) => {
    
    let response = await pm.getProducts()
    console.log("productos:",{response})
    if(req.query.limit){
        const limit = req.query.limit
        if(!Validador.validarNumero(limit)) return res.send("El limite debe ser un numero")
        if(!Validador.validarNumero(limit,1)) return res.send("El limite debe partir desde 1")
        if(!Validador.validarNumeroEntero(limit)) return res.send("El limite debe ser número entero")
        
        response = response.slice(0, limit)    
    }
    res.send(response)
})
/*************************************************************************************************** */

/* /products/:pid */
app.get('/products/:pid', async (req, res) => {
    
    
    let pid = req.params.pid
    console.log("pid:",{pid})
    if(!Validador.validarNumero(pid)) return res.send("El id de producto debe ser un numero")
    if(!Validador.validarNumero(pid,1)) return res.send("El id de producto debe partir desde 1")
    if(!Validador.validarNumeroEntero(pid)) return res.send("El id de producto debe ser número entero")
    pid = parseInt(pid)
    const response = await pm.getProductById(pid)
    if(!response){return res.send(`El producto no se encuentra`)}
    return res.send(response)
    
})

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