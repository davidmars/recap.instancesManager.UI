import format from 'date-fns/format';
import formatDistance  from 'date-fns/formatDistance';
import {fr,enGB} from 'date-fns/locale'


export default class EE09dateUtils{
    constructor() {
        /**
         * Un temps mis à jour qui peut être utilisé dans des getter afin d'être réactif
         * @type {Date}
         */
        this.live10secs=new Date();
        let me=this;
        setInterval(function(){
            me.live10secs=new Date();
        },1000)
    }
    /**
     * Renvoie la date actuelle formatée
     * @param {'yyyy/MM/dd'|'yyyy-MM-dd'|'HH:mm:ss'|String} fmt
     * @see https://date-fns.org/v2.17.0/docs/format
     */
    now(fmt){
        return this.format(new Date(), fmt)
    }

    /**
     * Permet de formater une date donnée
     * @param {Date} date
     * @param {'yyyy/MM/dd'|'yyyy-MM-dd'|'HH:mm:ss'|String} fmt
     * @param {*} options
     * @see https://date-fns.org/v2.17.0/docs/format
     */
    format(date,fmt,options={}){
        options.locale=this._getLocale(options.locale);
        return format(date, fmt,options);
    }

    /**
     * Renvoie un truc du style 'il y a 16 minutes'
     * @param date
     * @param baseDate
     * @param {*} options
     * @return {string | *}
     * @see https://date-fns.org/v2.17.0/docs/formatDistance
     */
    formatDistance(date, baseDate,options={}){
        options.locale=this._getLocale(options.locale);
        return formatDistance(date,baseDate,options);
    }

    _getLocale(str){
        switch (str){
            case "fr":
                return fr;
            default:
                return enGB;

        }
    }
}