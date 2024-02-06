export default class Validador{
    static validarNumero(numero, min, max){
        return !isNaN(numero) && min?numero >= min:true && max?numero <= max:true         
    }
    /**
     * valida que numero se entero
     * @param {*} numero 
     * @param {*} min 
     * @param {*} max 
     * @returns 
     */
    static validarNumeroEntero(numero,min, max){
        const esNumero = validarNumero(numero, min, max)
        return esNumero && parseInt(numero)
    }
}