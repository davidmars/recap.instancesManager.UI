export default class Manager{
    constructor() {
        /**
         * Instance en cours d'édition
         * @type {null|Instance}
         */
       this.selectedInstance=null;
        /**
         * Est-ce que la fenêtre d'édition est ouverte ou non ?
         * @type {boolean}
         */
       this.dialogOpen=false;

        /**
         * Les erreurs à afficher (une pile ui les affiche une par une)
         * @type {String[]}
         */
       this.errors=[];

       this._displayLogin=false;

    }

    /**
     * Faut il afficher le login ou pas ?
     * @return {boolean}
     */
    get displayLogin(){
        return window.$db.oneLoggedIn===false || this._displayLogin;
    }

    /**
     * Renvoie l'erreur à afficher si il y a lieu
     * @return {String|false}
     */
    get error(){
        if(this.errors.length){
            return this.errors[0];
        }
        return false;
    }
    get hasErrors(){
        return this.errors.length>0;
    }

    /**
     * Efface l'erreur actuellement affichée
     */
    killError(){
        if(this.errors.length){
            this.errors.shift();
        }
    }
}