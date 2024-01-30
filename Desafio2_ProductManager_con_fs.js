/*
Programación Backend
COMISIÓN Comisión 53095
ALUMNO JAVIER GONZALEZ BARRIENTOS

Consigna:
Realizar una clase de nombre “ProductManager”, 
el cual permitirá trabajar con múltiples productos. 
Éste debe poder agregar, consultar, modificar y eliminar un producto 
y manejarlo en persistencia de archivos (basado en entregable 1).

Aspectos a incluir
01 La clase debe contar con una variable this.path, 
el cual se inicializará desde el constructor y 
debe recibir la ruta a trabajar desde el momento de generar su instancia.

02 Debe guardar objetos con el siguiente formato:
- id (se debe incrementar automáticamente, no enviarse desde el cuerpo)
- title (nombre del producto)
- description (descripción del producto)
- price (precio)
- thumbnail (ruta de imagen)
- code (código identificador)
- stock (número de piezas disponibles)

03 Debe tener un método addProduct el cual debe recibir un objeto con el formato previamente especificado, asignarle un id autoincrementable y guardarlo en el arreglo (recuerda siempre guardarlo como un array en el archivo).
04 Debe tener un método getProducts, el cual debe leer el archivo de productos y devolver todos los productos en formato de arreglo.
05 Debe tener un método getProductById, el cual debe recibir un id, y tras leer el archivo, debe buscar el producto con el id especificado y devolverlo en formato objeto
06 Debe tener un método updateProduct, el cual debe recibir el id del producto a actualizar, así también como el campo a actualizar (puede ser el objeto completo, como en una DB), y debe actualizar el producto que tenga ese id en el archivo. NO DEBE BORRARSE SU ID 
07 Debe tener un método deleteProduct, el cual debe recibir un id y debe eliminar el producto que tenga ese id en el archivo



*/
const fs = require('fs');
class ProductManager{

    constructor(path){
        this.products = []
        this.path = path;
    }
    async readFile(){
        await fs.promises.readFile(this.path, 'utf-8')
    }
    async writeFile(data){
        await fs.promises.writeFile(this.path, data)
    }
    //03 Debe tener un método addProduct el cual debe recibir un objeto con el formato previamente especificado, asignarle un id autoincrementable y guardarlo en el arreglo (recuerda siempre guardarlo como un array en el archivo).
    async addProduct(title, description, price, thumbnail, code, stock){
        if(!title || !description || !price || !thumbnail || !code || !stock){
            console.log("Todos los campos son obligatorios");
            return;
        }
        if(this.products.find(product => product.code === code)){
            console.log("El código ya existe");
            return;
        }
        let archivo = await this.readFile()
        this.products = JSON.parse(archivo)

        const idIncremental = this.products.length + 1
        const newProduct = {
            id: idIncremental,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            toString(){
                return `id: ${this.id}, title: ${this.title}, description: ${this.description}, price: ${this.price}, thumbnail: ${this.thumbnail}, code: ${this.code}, stock: ${this.stock}`
            }
        }
        this.products.push(newProduct);

        await this.writeFile(JSON.stringify(this.products))
    }
    async getProducts(){
        return (JSON.parse(await this.readFile())).toString()
    }
    async getProductById(id){
        let archivo = await this.readFile()
        if(archivo === "") console.log("Not found");
        
        this.products = JSON.parse(archivo)

        const product = this.products.find(product => product.id === id)
        if(!product){
            console.log("Not found");
            return;
        }
        return product
    }

    //06 Debe tener un método updateProduct, el cual debe recibir el id del producto a actualizar, así también como el campo a actualizar (puede ser el objeto completo, como en una DB), y debe actualizar el producto que tenga ese id en el archivo. NO DEBE BORRARSE SU ID
    async updateProduct(id, title, description, price, thumbnail, code, stock){
        const product = await this.getProductById(id)
        if(!product){
            console.log("Not found");
            return;
        }
        if(title){
            product.title = title
        }
        if(description){
            product.description = description
        }
        if(price){
            product.price = price
        }
        if(thumbnail){
            product.thumbnail = thumbnail
        }
        if(code){
            product.code = code
        }
        if(stock){
            product.stock = stock
        }
        this.products = this.products.filter(product => product.id!== id)
        this.products.push(product)

        await this.writeFile(JSON.stringify(this.products))
    }
    //07 Debe tener un método deleteProduct, el cual debe recibir un id y debe eliminar el producto que tenga ese id en el Archivo
    async deleteProduct(id){
        const product = await this.getProductById(id)
        if(!product){
            console.log("Not found");
            return;
        }
        this.products = this.products.filter(product => product.id!== id)
        await this.writeFile(JSON.stringify(this.products))
        console.log(`Producto id ${product.id} borrado. `);
    }
}

/**
 * TEST
 */
const manager = new ProductManager();
console.log("test addProduct con error___________________________________________________")
manager.addProduct("product1", null, 100, "thumbnail1", "code1", 10);
console.log("test addProduct sin error___________________________________________________")
manager.addProduct("product1",  "descripcion", 100, "thumbnail1", "code1", 10);
manager.addProduct("product2",  "descripcion2", 2200, "thumbnail2", "code222", 100);
console.log("test getProducts___________________________________________________")
console.log(manager.getProducts().join("\n"));
console.log("test getProductById con error___________________________________________________")
console.log(manager.getProductById(122222));
console.log("test getProductById sin error___________________________________________________")
console.log(manager.getProductById(1));
