export default class EE09localStorage{
    constructor(prefix) {
        this.prefix=prefix;
    }

    /**
     * Efface la variable du local storage
     * @param prop
     */
    remove(prop){
        localStorage.removeItem(prop);
    }
    /**
     * Renvoie un booleen
     * @param prop
     * @param defaultVal
     * @return {boolean|*}
     */
    getBool(prop,defaultVal){
        let v=localStorage.getItem(`${this.prefix}_${prop}`);
        if(v===null){
            return defaultVal;
        }
        if(v==="1"){
            return true;
        }
        return false;
    }
    setBool(prop,val){
        localStorage.setItem(`${this.prefix}_${prop}`,val===true?'1':'0');
        return val;
    }

    /**
     * Renvoie une string
     * @param {string} prop
     * @param {string} defaultVal
     * @return {string}
     */
    getString(prop,defaultVal=""){
        let v=localStorage.getItem(`${this.prefix}_${prop}`);
        if(v===null || v==="undefined"){
            return defaultVal;
        }
        return String(v);
    }

    /**
     * Set une string
     * @param {string} prop
     * @param {string} val
     * @return {string}
     */
    setString(prop,val){
        localStorage.setItem(`${this.prefix}_${prop}`,String(val));
        return val;
    }
}