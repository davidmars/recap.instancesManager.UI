import isEmail from "validator/lib/isEmail";
import EE09dateUtils from "@/utils/EE09dateUtils";
import BrowserUtils from "@/utils/BrowserUtils";
const filesize=require('filesize');

export default class Utils{

    constructor() {
        this.date=new EE09dateUtils();
        this.browser=new BrowserUtils();
    }
    winOpen(url){
        window.open(url);
    }
    /**
     * Formate un nombre en mode 1234 = 1.234B
     * @param {number} num
     * @return {string}
     */
    numFmt(num){
        return new Intl.NumberFormat(
            "de-DE",{
                //style: "currency",
                //currency:"THB",
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
            }).format(num)
    }

    /**
     * Renvoie une valeur en fonction d'un autre espace de valeur
     * @param {Number} input
     * @param {Number} maxInput
     * @param {Number} maxOutput
     * @param {Number} minInput
     * @param {Number} minOutput
     * @return {Number}
     */
    ratio (input,minInput, maxInput,minOutput, maxOutput) {
        let factor = (input - minInput) / (maxInput - minInput);
        let out = ((maxOutput - minOutput) * factor) + minOutput;
        return out;
    }

    /**
     * Renvoie true si c'est un email
     * @param {string} mail
     * @return {boolean}
     */
    isEmail(mail){
        if(!mail){
            return false;
        }
        return isEmail(mail);
    }
    /**
     * Convertit des degrés en radians
     * @param degrees
     * @return {number}
     */
    deg2rad(degrees){
        return degrees * (Math.PI/180);
    }

    /**
     * Renvoie la distance en mètre entre les deux coordonnées
     * @param lat1
     * @param lng1
     * @param lat2
     * @param lng2
     * @return {number}
     */
    distance(lat1,lng1,lat2,lng2){
        let toRad=function(v)
        {
            return v * Math.PI / 180;
        }
        let R = 6371; // km
        let dLat = toRad(lat2-lat1);
        let dLon = toRad(lng2-lng1);
        lat1 = toRad(lat1);
        lat2 = toRad(lat2);

        let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        let d = R * c;
        return d *1000;
    }

    /**
     * Renvoie la taille du fichier en Kb Mb etc...
     * @param {number|File} bytesOrFile
     * @return {string}
     */
    humanSize(bytesOrFile){
        let bytes=bytesOrFile;
        if(bytesOrFile && bytesOrFile instanceof File){
            bytes=bytesOrFile.size;
        }
        return filesize(bytes,{locale:"fr",round:1});
    }
}