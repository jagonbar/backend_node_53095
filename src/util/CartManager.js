import fs from 'fs'

/**
 * Clase para gestionar carritos
 */
export default class CartManager {

    /**
     * Constructor de la clase CartManager
     * @param {string} path - Ruta del archivo donde se almacenarán los carritos
     */
    constructor(path) {
        this.carts = []
        this.path = path
    }

    /**
     * Lee el archivo de carritos desde el sistema de archivos
     * @returns {Array} Retorna un array de carritos si el archivo existe, sino false
     */
    async readFile() {
        let carts = await fs.promises.readFile(this.path, 'utf-8') ?? false;
        if (!carts) return false;
        carts = JSON.parse(carts);
        this.carts = carts
        return this.carts
    }

    /**
     * Escribe el array de carritos en el sistema de archivos
     */
    async writeFile() {
        const data = JSON.stringify(this.carts);
        await fs.promises.writeFile(this.path, data)
    }   
    /**
     * Crea un nuevo carrito y lo añade al array de carritos
     * @returns {Number} Retorna el ID del carrito creado
     */
    async createCart() {
        let carts = await this.readFile()
        this.carts = carts ?? [];
        const idIncremental = this.carts.length + 1
        const newCart = {
            id: idIncremental,
            products: []
        }
        this.carts.push(newCart)
        await this.writeFile()
        return idIncremental
    }

    /**
     * Obtiene un carrito por su ID
     * @param {Number} cid - ID del carrito
     * @returns {Object} Retorna el carrito si se encuentra, sino undefined
     */
    async getCartById(cid) {
        await this.readFile()
        const cart = this.carts.find(cart => cart.id === cid)
        
        if(!cart){ return false}
        
        return cart
    }

    /**
     * Añade un producto a un carrito
     * @param {Number} cid - ID del carrito
     * @param {Number} pid - ID del producto
     * @returns {Boolean} Retorna true si el producto es añadido con éxito
     */
    async addProductToCart(cid, pid) {
        cid = parseInt(cid) 
        pid = parseInt(pid)
        
        let cantidadAsignada =1

        const cart = await this.getCartById(cid)

        if(!cart) {
            return false
        }
            
                    
        this.carts = this.carts.map(c => {
            if(parseInt(c.id) === parseInt(cid))
            {
                if(c.products.length>0)
                {
                    if(!c.products.includes(pid))
                    { 
                                c.products = c.products.map(p=>{
                                    if(parseInt(p) === parseInt(pid)){
                                        p.quantity++
                                    }
                                    return p
                                })
                    }else{
                        c.products.push(newProduct(pid,cantidadAsignada))
                    }//end if includes
                }//end if length
            }//end if id
        })//endmap
                            
        await this.writeFile()
        return cantidadAsignada
    }
}

