// const fs = require('fs');
import fs from 'fs'

export default class ProductManager{

    constructor(path){
        this.products = []
        this.path = path;        
    }
    async readFile(){
        let products = await fs.promises.readFile(this.path, 'utf-8') ?? false;
        if (!products) return false;
        products = JSON.parse(products);
        this.products = products.map((p)=>{
            return {...p,toString:()=>(`id:${p.id} , title:${p.title} , description:${p.description} , price:${p.price} , thumbnail:${p.thumbnail} , code:${p.code} , stock:${p.stock}`)}
        });        
        return this.products
    }
    async writeFile(){
        
        
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
        // if(this.products.find(product => product.code === code)){
        //     console.log("El código ya existe");
        //     return false;
        // }
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
        let products = await this.readFile()
        if(!products) {console.log("Not found"); return false;}        
        console.log('getProductById')
        // console.log({products})
        
        const product = this.products.find(product => parseInt(product.id) === parseInt(id) || product.id === id)
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