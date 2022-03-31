export default class Manager{
    constructor() {
        /**
         * Instance en cours d'édition
         * @type {null|Object}
         */
       this.selectedInstance=null;
        /**
         * Est-ce que la fenêtre d'édition est ouverte ou non ?
         * @type {boolean}
         */
       this.dialogOpen=false;
    }
}