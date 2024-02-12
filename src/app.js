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
const port = 8080
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
// La ruta raíz GET / deberá listar todos los productos de la base.
app.get('/api/products', async (req, res) => {

    try {
        let response = await pm.getProducts();
        console.log("productos:", { response });
        if (req.query.limit) {
            const limit = req.query.limit;
            if (!Validador.validarNumero(limit)) return res.status(400).send("El limite debe ser un numero");
            if (!Validador.validarNumero(limit, 1)) return res.status(400).send("El limite debe partir desde 1");
            if (!Validador.validarNumeroEntero(limit)) return res.status(400).send("El limite debe ser número entero");

            response = response.slice(0, limit);
        }
        res.status(200).send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("error_al_listar_productos");
    }
})
/*************************************************************************************************** */

// La ruta GET /:pid deberá traer sólo el producto con el id proporcionado
app.get('/api/products/:pid', async (req, res) => {
    try {
        let pid = req.params.pid
        console.log("pid:", { pid })
        if (!Validador.validarNumero(pid)) return res.status(400).send("El id de producto debe ser un numero")
        if (!Validador.validarNumero(pid, 1)) return res.status(400).send("El id de producto debe partir desde 1")
        if (!Validador.validarNumeroEntero(pid)) return res.status(400).send("El id de producto debe ser número entero")
        pid = parseInt(pid)
        const response = await pm.getProductById(pid)
        if (!response) {
            return res.status(404).send(`El producto no se encuentra`);
        }

        return res.status(200).send(response)
    } catch (error) {
        console.error(error);
        res.status(500).send("error_al_listar_productos");
    }
})
/**
 * La ruta raíz POST / deberá agregar un nuevo producto con los campos:
id: Number/String (A tu elección, el id NO se manda desde body, 
    se autogenera como lo hemos visto desde los primeros entregables, 
    asegurando que NUNCA se repetirán los ids en el archivo.
title:String,
description:String
code:String
price:Number
status:Boolean
stock:Number
category:String
thumbnails:Array de Strings que contengan las rutas donde 
están almacenadas las imágenes referentes a dicho producto
*/
app.post('/api/products', async (req, res) => {
    try {
        const { title
            , description
            , code
            , price
            , status
            , stock
            , category
            , thumbnails } = req.body

        const idProduct = await pm.addProduct(
            title
            , description
            , price
            , thumbnails
            , code
            , stock
            , status
            , category
        )
        res.status(200).send(idProduct)
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Error al agregar el producto");
    }
})
/**
 * La ruta PUT /:pid deberá tomar un producto y actualizarlo por los 
 * campos enviados desde body. NUNCA se debe actualizar 
 * o eliminar el id al momento de hacer dicha actualización.
*/
app.put('/api/products/:pid', async (req, res) => {
    try {
        const id = req.params.pid
        const { title, description, price, thumbnail, code, stock, status, category } = req.body
        const r = await pm.updateProduct(id, title, description, price, thumbnail, code, stock, status, category)
        res.status(200).send(r)
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al actualizar el producto");
    }
})
/**
 * La ruta DELETE /:pid deberá eliminar el producto con el pid indicado. 
 */
app.delete('/api/products/:pid', async (req, res) => {
    try {
        const pid = req.params.pid
        const r = await pm.deleteProduct(pid)
        res.status(200).send(r)
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al eliminar el producto");
    }
})
/*************************************************************************************************** */
/**
 * CARRITO
 * Para el carrito, el cual tendrá su router en /api/carts/, configurar dos rutas
 */

/**
 * La ruta raíz POST / deberá crear un nuevo carrito con la siguiente estructura:
Id      : Number/String 
        (A tu elección, de igual manera como con los productos, 
        debes asegurar que nunca se dupliquen los ids y que este se autogenere).
products: Array que contendrá objetos que representen cada producto
 */

/**
 * La ruta GET /:cid deberá listar los productos que pertenezcan 
 * al carrito con el parámetro cid proporcionados.
 */

/**
 * La ruta POST  /:cid/product/:pid deberá agregar el producto 
 * al arreglo "products" del carrito seleccionado, 
 * agregándose como un objeto bajo el siguiente formato:
 * - product : SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo)
 * - quantity: debe contener el número de ejemplares de dicho producto. 
 *             El producto, de momento, se agregará de uno en uno.
 * Además, si un producto ya existente intenta agregarse al producto, 
 * incrementar el campo quantity de dicho producto.
 */

/*************************************************************************************************** */
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