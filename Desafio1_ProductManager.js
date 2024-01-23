/*
Programación Backend
COMISIÓN Comisión 53095
ALUMNO JAVIER GONZALEZ BARRIENTOS

Realizar una clase “ProductManager” que gestione un conjunto de productos.
Debe crearse desde su constructor con el elemento products, el cual será un arreglo vacío.
Cada producto que gestione debe contar con las propiedades:
-title (nombre del producto)
-description (descripción del producto)
-price (precio)
-thumbnail (ruta de imagen)
-code (código identificador)
-stock (número de piezas disponibles)

Debe contar con un método “addProduct” el cual agregará un producto al arreglo de productos inicial.
Validar que no se repita el campo “code” y que todos los campos sean obligatorios
Al agregarlo, debe crearse con un id autoincrementable.

Debe contar con un método “getProducts” el cual debe devolver el arreglo con todos los productos creados hasta ese momento

Debe contar con un método “getProductById” el cual debe buscar en el arreglo el producto que coincida con el id
En caso de no coincidir ningún id, mostrar en consola un error “Not found”

Formato del entregable
Archivo de Javascript listo para ejecutarse desde node.

*/
class ProductManager{

    constructor(){
        this.products = []
    }
    addProduct(title, description, price, thumbnail, code, stock){
        if(!title || !description || !price || !thumbnail || !code || !stock){
            console.log("Todos los campos son obligatorios");
            return;
        }
        if(this.products.find(product => product.code === code)){
            console.log("El código ya existe");
            return;
        }
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
    }
    getProducts(){
        return this.products
    }
    getProductById(id){
        const product = this.products.find(product => product.id === id)
        if(!product){
            console.log("Not found");
            return;
        }
        return product
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
