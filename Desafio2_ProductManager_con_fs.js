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
        if(path!=='') fs.writeFileSync(path, JSON.stringify([]));
    }
    async readFile(){
        let products = await fs.promises.readFile(this.path, 'utf-8') ?? false;
        if (!products) return false;
        products = JSON.parse(products);
        
        return products.map((p)=>{
            return {...p,toString:()=>(`id:${p.id} , title:${p.title} , description:${p.description} , price:${p.price} , thumbnail:${p.thumbnail} , code:${p.code} , stock:${p.stock}`)}
        });        
    }
    async writeFile(){
        
        // const replacer = (key, value) => {
        //     if(
        //         key==='id' ||
        //         key==='title' ||
        //         key==='description' ||
        //         key==='price' ||
        //         key==='thumbnail' ||
        //         key==='code' ||
        //         key==='stock'
        //     ){
        //         return value
        //     }
               
        //     return undefined;
        // };
        let debug= this.products
        // console.log({ debug })

        // const data = JSON.stringify(this.products, replacer);
        const data = JSON.stringify(this.products);
        // console.log({data})
        await fs.promises.writeFile(this.path, data)
    }
    //03 Debe tener un método addProduct el cual debe recibir un objeto con el formato previamente especificado, asignarle un id autoincrementable y guardarlo en el arreglo (recuerda siempre guardarlo como un array en el archivo).
    async addProduct(title, description, price, thumbnail, code, stock){
        if(!title || !description || !price || !thumbnail || !code || !stock){
            console.log("Todos los campos son obligatorios");
            return false;
        }
        if(this.products.find(product => product.code === code)){
            console.log("El código ya existe");
            return false;
        }
        let products = await this.readFile()
        this.products = products ?? [];

        const idIncremental = this.products.length + 1
        const newProduct = {
            id: idIncremental,
            title,
            description,
            price,
            thumbnail,
            code,
            stock            
        }
        this.products.push(newProduct);

        await this.writeFile()
        return newProduct;
    }
    async getProducts(){
        return await this.readFile() ?? []
    }
    async getProductById(id){
        let archivo = await this.readFile()
        if(!archivo) {console.log("Not found"); return false;}        

        const product = this.products.find(product => product.id === id)
        if(!product){
            console.log("Not found");
            return false;
        }
        return product
    }

    //06 Debe tener un método updateProduct, el cual debe recibir el id del producto a actualizar, así también como el campo a actualizar (puede ser el objeto completo, como en una DB), y debe actualizar el producto que tenga ese id en el archivo. NO DEBE BORRARSE SU ID
    async updateProduct(id, title, description, price, thumbnail, code, stock){
        const product = await this.getProductById(id)
        if(!product){
            console.log("Not found");
            return false;
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

        await this.writeFile()
    }
    //07 Debe tener un método deleteProduct, el cual debe recibir un id y debe eliminar el producto que tenga ese id en el Archivo
    async deleteProduct(id){
        const product = await this.getProductById(id)
        if(!product){
            console.log("Not found");
            return false;
        }
        this.products = this.products.filter(product => product.id!== id)
        await this.writeFile()
        console.log(`Producto id ${product.id} borrado. `);
    }
}

/**
 * TEST
 */

//PROCESO DE TESTING
try{
(async ()=>{    
            // 01 - Se creará una instancia de la clase “ProductManager”
            const manager = new ProductManager('./products.json');

            // 02 - Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
            console.log("--Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío:");
            let products = await manager.getProducts()
                console.log({products});

            // 03 - Se llamará al método “addProduct” con los campos: 
            /*
            title: “producto prueba”
            description:”Este es un producto prueba”
            price:200,
            thumbnail:”Sin imagen”
            code:”abc123”,
            stock:25
            */
            // 04 - El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
            console.log("--Se llamará al método “addProduct” con los campos: ");
            let p = await manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
                console.log({p});

            // 05 - Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
            console.log("--Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado: ")
            products = await manager.getProducts()
                console.log({products});



            // 06 - Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.
            console.log("--Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.")
            let product = await manager.getProductById(1);
                console.log({product});

                
            // 07 - Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.
            console.log("--Se llamará al método “updateProduct” y se intentará cambiar un campo , se evaluará que no se elimine el id y que sí se haya hecho la actualización.")
            await manager.updateProduct(1, "producto prueba 2", "Este es un producto prueba 2", 200, "Sin imagen", "abc123", 25);
            product = await manager.getProductById(1)
            console.log({product});                            
                
            // 08 - Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
            console.log("--Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.")
            await manager.deleteProduct(1);
})()            
}catch(error){
    console.log(error)
}