const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
const axios = require('axios');
const routes = require('./routes');
const socketIO = require('socket.io');
const moment = require('moment');
const timeout = require('connect-timeout');
const genuuid = require('uuid');

const redis = require('redis');
const redisStore = require('connect-redis')(session);

// crear conexion ala DB
const db = require('./config/db');

// Importar modelo
require('./models/usuariosModelo');
require('./models/plataformasModelo');
require('./models/marcasModelo');
require('./models/asignacionesModelo');
require('./models/cuentasModelo');
require('./models/gananciasModelo');
require('./models/consignacionesModelo');
require('./models/mediosModelo');
require('./models/linksPseModelo');
require('./models/insidenciasModelo');
require('./models/cargasModelo');
require('./models/preguntasModelo');
require('./models/publicidadModelo');

db.sync()
    .then(() => console.log('Conectado a la base de datos'))
    .catch(error => console.log(error));

// Variables de entorno
dotenv.config({
    path: path.resolve(__dirname, 'production.env')
});

// Redis connection server
const REDIS_CLIENT_PASSWORD = process.env.REDIS_CLIENT_PASSWORD
REDIS_CLIENT_HOST = process.env.REDIS_CLIENT_HOST,
    REDIS_CLIENT_PORT = process.env.REDIS_CLIENT_PORT,
    REDIS_CLIENT_USER = process.env.REDIS_CLIENT_USER;

const url = `redis://${REDIS_CLIENT_USER}:${REDIS_CLIENT_PASSWORD}@${REDIS_CLIENT_HOST}:${REDIS_CLIENT_PORT}`;

const redisClient = redis.createClient(url);

// Events and errors from redis
redisClient.on('connect', () => {
    console.log('Connected with redis');
});

redisClient.on('error', (err) => {
    console.log('Redis error: ', err);
});

// crear el servidor
const app = express();

// habilitar EJS
app.set('view engine', 'ejs');

// ubicacion vistas
app.set('views', path.join(__dirname, './views'));

// archivos estaticos
app.use(express.static('public'));

// habilitar cookie parser
app.use(cookieParser());


// Asignando redis para la sesión
app.use(session({
    genid: (req) => {
        return genuuid.v4();
    },
    store: new redisStore({
        host: REDIS_CLIENT_HOST,
        port: REDIS_CLIENT_PORT,
        client: redisClient
    }),
    name: 'x-sotken',
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 3600000,
    },
    saveUninitialized: true
}));

// inicializar passport
app.use(passport.initialize());
app.use(passport.session());

// Agregar flash messages
app.use(flash());

let paisesJson = {
    data: [ {
    "name": "Afghanistan",
    "cca2": "af",
    "calling-code": "93"
}, {
    "name": "Albania",
    "cca2": "al",
    "calling-code": "355"
}, {
    "name": "Algeria",
    "cca2": "dz",
    "calling-code": "213"
}, {
    "name": "American Samoa",
    "cca2": "as",
    "calling-code": "1684"
}, {
    "name": "Andorra",
    "cca2": "ad",
    "calling-code": "376"
}, {
    "name": "Angola",
    "cca2": "ao",
    "calling-code": "244"
}, {
    "name": "Anguilla",
    "cca2": "ai",
    "calling-code": "1264"
}, {
    "name": "Antigua and Barbuda",
    "cca2": "ag",
    "calling-code": "1268"
}, {
    "name": "Argentina",
    "cca2": "ar",
    "calling-code": "54"
}, {
    "name": "Armenia",
    "cca2": "am",
    "calling-code": "374"
}, {
    "name": "Aruba",
    "cca2": "aw",
    "calling-code": "297"
}, {
    "name": "Australia",
    "cca2": "au",
    "calling-code": "61"
}, {
    "name": "Austria",
    "cca2": "at",
    "calling-code": "43"
}, {
    "name": "Azerbaijan",
    "cca2": "az",
    "calling-code": "994"
}, {
    "name": "Bahamas",
    "cca2": "bs",
    "calling-code": "1242"
}, {
    "name": "Bahrain",
    "cca2": "bh",
    "calling-code": "973"
}, {
    "name": "Bangladesh",
    "cca2": "bd",
    "calling-code": "880"
}, {
    "name": "Barbados",
    "cca2": "bb",
    "calling-code": "1246"
}, {
    "name": "Belarus",
    "cca2": "by",
    "calling-code": "375"
}, {
    "name": "Belgium",
    "cca2": "be",
    "calling-code": "32"
}, {
    "name": "Belize",
    "cca2": "bz",
    "calling-code": "501"
}, {
    "name": "Benin",
    "cca2": "bj",
    "calling-code": "229"
}, {
    "name": "Bermuda",
    "cca2": "bm",
    "calling-code": "1441"
}, {
    "name": "Bhutan",
    "cca2": "bt",
    "calling-code": "975"
}, {
    "name": "Bolivia",
    "cca2": "bo",
    "calling-code": "591"
}, {
    "name": "Bosnia and Herzegovina",
    "cca2": "ba",
    "calling-code": "387"
}, {
    "name": "Botswana",
    "cca2": "bw",
    "calling-code": "267"
}, {
    "name": "Brazil",
    "cca2": "br",
    "calling-code": "55"
}, {
    "name": "Brunei Darussalam",
    "cca2": "bn",
    "calling-code": "673"
}, {
    "name": "Bulgaria",
    "cca2": "bg",
    "calling-code": "359"
}, {
    "name": "Burkina Faso",
    "cca2": "bf",
    "calling-code": "226"
}, {
    "name": "Burundi",
    "cca2": "bi",
    "calling-code": "257"
}, {
    "name": "Cambodia",
    "cca2": "kh",
    "calling-code": "855"
}, {
    "name": "Cameroon",
    "cca2": "cm",
    "calling-code": "237"
}, {
    "name": "Canada",
    "cca2": "ca",
    "calling-code": "1"
}, {
    "name": "Cape Verde",
    "cca2": "cv",
    "calling-code": "238"
}, {
    "name": "Cayman Islands",
    "cca2": "ky",
    "calling-code": "1345"
}, {
    "name": "Central African Republic",
    "cca2": "cf",
    "calling-code": "236"
}, {
    "name": "Chad",
    "cca2": "td",
    "calling-code": "235"
}, {
    "name": "Chile",
    "cca2": "cl",
    "calling-code": "56"
}, {
    "name": "China",
    "cca2": "cn",
    "calling-code": "86"
}, {
    "name": "Colombia",
    "cca2": "co",
    "calling-code": "57"
}, {
    "name": "Comoros",
    "cca2": "km",
    "calling-code": "269"
}, {
    "name": "Congo (DRC)",
    "cca2": "cd",
    "calling-code": "243"
}, {
    "name": "Congo (Republic)",
    "cca2": "cg",
    "calling-code": "242"
}, {
    "name": "Cook Islands",
    "cca2": "ck",
    "calling-code": "682"
}, {
    "name": "Costa Rica",
    "cca2": "cr",
    "calling-code": "506"
}, {
    "name": "CÃ´te d'Ivoire",
    "cca2": "ci",
    "calling-code": "225"
}, {
    "name": "Croatia",
    "cca2": "hr",
    "calling-code": "385"
}, {
    "name": "Cuba",
    "cca2": "cu",
    "calling-code": "53"
}, {
    "name": "Cyprus",
    "cca2": "cy",
    "calling-code": "357"
}, {
    "name": "Czech Republic",
    "cca2": "cz",
    "calling-code": "420"
}, {
    "name": "Denmark",
    "cca2": "dk",
    "calling-code": "45"
}, {
    "name": "Djibouti",
    "cca2": "dj",
    "calling-code": "253"
}, {
    "name": "Dominica",
    "cca2": "dm",
    "calling-code": "1767"
}, {
    "name": "Dominican Republic",
    "cca2": "do",
    "calling-code": "1809"
}, {
    "name": "Ecuador",
    "cca2": "ec",
    "calling-code": "593"
}, {
    "name": "Egypt",
    "cca2": "eg",
    "calling-code": "20"
}, {
    "name": "El Salvador",
    "cca2": "sv",
    "calling-code": "503"
}, {
    "name": "Equatorial Guinea",
    "cca2": "gq",
    "calling-code": "240"
}, {
    "name": "Eritrea",
    "cca2": "er",
    "calling-code": "291"
}, {
    "name": "Estonia",
    "cca2": "ee",
    "calling-code": "372"
}, {
    "name": "Ethiopia",
    "cca2": "et",
    "calling-code": "251"
}, {
    "name": "Faroe Islands",
    "cca2": "fo",
    "calling-code": "298"
}, {
    "name": "Fiji",
    "cca2": "fj",
    "calling-code": "679"
}, {
    "name": "Finland",
    "cca2": "fi",
    "calling-code": "358"
}, {
    "name": "France",
    "cca2": "fr",
    "calling-code": "33"
}, {
    "name": "French Polynesia",
    "cca2": "pf",
    "calling-code": "689"
}, {
    "name": "Gabon",
    "cca2": "ga",
    "calling-code": "241"
}, {
    "name": "Gambia",
    "cca2": "gm",
    "calling-code": "220"
}, {
    "name": "Georgia",
    "cca2": "ge",
    "calling-code": "995"
}, {
    "name": "Germany",
    "cca2": "de",
    "calling-code": "49"
}, {
    "name": "Ghana",
    "cca2": "gh",
    "calling-code": "233"
}, {
    "name": "Gibraltar",
    "cca2": "gi",
    "calling-code": "350"
}, {
    "name": "Greece",
    "cca2": "gr",
    "calling-code": "30"
}, {
    "name": "Greenland",
    "cca2": "gl",
    "calling-code": "299"
}, {
    "name": "Grenada",
    "cca2": "gd",
    "calling-code": "1473"
}, {
    "name": "Guadeloupe",
    "cca2": "gp",
    "calling-code": "590"
}, {
    "name": "Guam",
    "cca2": "gu",
    "calling-code": "1671"
}, {
    "name": "Guatemala",
    "cca2": "gt",
    "calling-code": "502"
}, {
    "name": "Guernsey",
    "cca2": "gg",
    "calling-code": "44"
}, {
    "name": "Guinea",
    "cca2": "gn",
    "calling-code": "224"
}, {
    "name": "Guinea-Bissau",
    "cca2": "gw",
    "calling-code": "245"
}, {
    "name": "Guyana",
    "cca2": "gy",
    "calling-code": "592"
}, {
    "name": "Haiti",
    "cca2": "ht",
    "calling-code": "509"
}, {
    "name": "Honduras",
    "cca2": "hn",
    "calling-code": "504"
}, {
    "name": "Hong Kong",
    "cca2": "hk",
    "calling-code": "852"
}, {
    "name": "Hungary",
    "cca2": "hu",
    "calling-code": "36"
}, {
    "name": "Iceland",
    "cca2": "is",
    "calling-code": "354"
}, {
    "name": "India",
    "cca2": "in",
    "calling-code": "91"
}, {
    "name": "Indonesia",
    "cca2": "id",
    "calling-code": "62"
}, {
    "name": "Iran",
    "cca2": "ir",
    "calling-code": "98"
}, {
    "name": "Iraq",
    "cca2": "iq",
    "calling-code": "964"
}, {
    "name": "Ireland",
    "cca2": "ie",
    "calling-code": "353"
}, {
    "name": "Isle of Man",
    "cca2": "im",
    "calling-code": "44"
}, {
    "name": "Israel",
    "cca2": "il",
    "calling-code": "972"
}, {
    "name": "Italy",
    "cca2": "it",
    "calling-code": "39"
}, {
    "name": "Jamaica",
    "cca2": "jm",
    "calling-code": "1876"
}, {
    "name": "Japan",
    "cca2": "jp",
    "calling-code": "81"
}, {
    "name": "Jersey",
    "cca2": "je",
    "calling-code": "44"
}, {
    "name": "Jordan",
    "cca2": "jo",
    "calling-code": "962"
}, {
    "name": "Kazakhstan",
    "cca2": "kz",
    "calling-code": "7"
}, {
    "name": "Kenya",
    "cca2": "ke",
    "calling-code": "254"
}, {
    "name": "Kiribati",
    "cca2": "ki",
    "calling-code": "686"
}, {
    "name": "Kuwait",
    "cca2": "kw",
    "calling-code": "965"
}, {
    "name": "Kyrgyzstan",
    "cca2": "kg",
    "calling-code": "996"
}, {
    "name": "Laos",
    "cca2": "la",
    "calling-code": "856"
}, {
    "name": "Latvia",
    "cca2": "lv",
    "calling-code": "371"
}, {
    "name": "Lebanon",
    "cca2": "lb",
    "calling-code": "961"
}, {
    "name": "Lesotho",
    "cca2": "ls",
    "calling-code": "266"
}, {
    "name": "Liberia",
    "cca2": "lr",
    "calling-code": "231"
}, {
    "name": "Libya",
    "cca2": "ly",
    "calling-code": "218"
}, {
    "name": "Liechtenstein",
    "cca2": "li",
    "calling-code": "423"
}, {
    "name": "Lithuania",
    "cca2": "lt",
    "calling-code": "370"
}, {
    "name": "Luxembourg",
    "cca2": "lu",
    "calling-code": "352"
}, {
    "name": "Macao",
    "cca2": "mo",
    "calling-code": "853"
}, {
    "name": "Macedonia",
    "cca2": "mk",
    "calling-code": "389"
}, {
    "name": "Madagascar",
    "cca2": "mg",
    "calling-code": "261"
}, {
    "name": "Malawi",
    "cca2": "mw",
    "calling-code": "265"
}, {
    "name": "Malaysia",
    "cca2": "my",
    "calling-code": "60"
}, {
    "name": "Maldives",
    "cca2": "mv",
    "calling-code": "960"
}, {
    "name": "Mali",
    "cca2": "ml",
    "calling-code": "223"
}, {
    "name": "Malta",
    "cca2": "mt",
    "calling-code": "356"
}, {
    "name": "Marshall Islands",
    "cca2": "mh",
    "calling-code": "692"
}, {
    "name": "Martinique",
    "cca2": "mq",
    "calling-code": "596"
}, {
    "name": "Mauritania",
    "cca2": "mr",
    "calling-code": "222"
}, {
    "name": "Mauritius",
    "cca2": "mu",
    "calling-code": "230"
}, {
    "name": "Mexico",
    "cca2": "mx",
    "calling-code": "52"
}, {
    "name": "Micronesia",
    "cca2": "fm",
    "calling-code": "691"
}, {
    "name": "Moldova",
    "cca2": "md",
    "calling-code": "373"
}, {
    "name": "Monaco",
    "cca2": "mc",
    "calling-code": "377"
}, {
    "name": "Mongolia",
    "cca2": "mn",
    "calling-code": "976"
}, {
    "name": "Montenegro",
    "cca2": "me",
    "calling-code": "382"
}, {
    "name": "Montserrat",
    "cca2": "ms",
    "calling-code": "1664"
}, {
    "name": "Morocco",
    "cca2": "ma",
    "calling-code": "212"
}, {
    "name": "Mozambique",
    "cca2": "mz",
    "calling-code": "258"
}, {
    "name": "Myanmar (Burma)",
    "cca2": "mm",
    "calling-code": "95"
}, {
    "name": "Namibia",
    "cca2": "na",
    "calling-code": "264"
}, {
    "name": "Nauru",
    "cca2": "nr",
    "calling-code": "674"
}, {
    "name": "Nepal",
    "cca2": "np",
    "calling-code": "977"
}, {
    "name": "Netherlands",
    "cca2": "nl",
    "calling-code": "31"
}, {
    "name": "New Caledonia",
    "cca2": "nc",
    "calling-code": "687"
}, {
    "name": "New Zealand",
    "cca2": "nz",
    "calling-code": "64"
}, {
    "name": "Nicaragua",
    "cca2": "ni",
    "calling-code": "505"
}, {
    "name": "Niger",
    "cca2": "ne",
    "calling-code": "227"
}, {
    "name": "Nigeria",
    "cca2": "ng",
    "calling-code": "234"
}, {
    "name": "North Korea",
    "cca2": "kp",
    "calling-code": "850"
}, {
    "name": "Norway",
    "cca2": "no",
    "calling-code": "47"
}, {
    "name": "Oman",
    "cca2": "om",
    "calling-code": "968"
}, {
    "name": "Pakistan",
    "cca2": "pk",
    "calling-code": "92"
}, {
    "name": "Palau",
    "cca2": "pw",
    "calling-code": "680"
}, {
    "name": "Palestinian Territory",
    "cca2": "ps",
    "calling-code": "970"
}, {
    "name": "Panama",
    "cca2": "pa",
    "calling-code": "507"
}, {
    "name": "Papua New Guinea",
    "cca2": "pg",
    "calling-code": "675"
}, {
    "name": "Paraguay",
    "cca2": "py",
    "calling-code": "595"
}, {
    "name": "Peru",
    "cca2": "pe",
    "calling-code": "51"
}, {
    "name": "Philippines",
    "cca2": "ph",
    "calling-code": "63"
}, {
    "name": "Poland",
    "cca2": "pl",
    "calling-code": "48"
}, {
    "name": "Portugal",
    "cca2": "pt",
    "calling-code": "351"
}, {
    "name": "Puerto Rico",
    "cca2": "pr",
    "calling-code": "1787"
}, {
    "name": "Qatar",
    "cca2": "qa",
    "calling-code": "974"
}, {
    "name": "RÃ©union",
    "cca2": "re",
    "calling-code": "262"
}, {
    "name": "Romania",
    "cca2": "ro",
    "calling-code": "40"
}, {
    "name": "Russian Federation",
    "cca2": "ru",
    "calling-code": "7"
}, {
    "name": "Rwanda",
    "cca2": "rw",
    "calling-code": "250"
}, {
    "name": "Saint Kitts and Nevis",
    "cca2": "kn",
    "calling-code": "1869"
}, {
    "name": "Saint Lucia",
    "cca2": "lc",
    "calling-code": "1758"
}, {
    "name": "Saint Vincent and the Grenadines",
    "cca2": "vc",
    "calling-code": "1784"
}, {
    "name": "Samoa",
    "cca2": "ws",
    "calling-code": "685"
}, {
    "name": "San Marino",
    "cca2": "sm",
    "calling-code": "378"
}, {
    "name": "SÃ£o TomÃ© and PrÃ­ncipe",
    "cca2": "st",
    "calling-code": "239"
}, {
    "name": "Saudi Arabia",
    "cca2": "sa",
    "calling-code": "966"
}, {
    "name": "Senegal",
    "cca2": "sn",
    "calling-code": "221"
}, {
    "name": "Serbia",
    "cca2": "rs",
    "calling-code": "381"
}, {
    "name": "Seychelles",
    "cca2": "sc",
    "calling-code": "248"
}, {
    "name": "Sierra Leone",
    "cca2": "sl",
    "calling-code": "232"
}, {
    "name": "Singapore",
    "cca2": "sg",
    "calling-code": "65"
}, {
    "name": "Slovakia",
    "cca2": "sk",
    "calling-code": "421"
}, {
    "name": "Slovenia",
    "cca2": "si",
    "calling-code": "386"
}, {
    "name": "Solomon Islands",
    "cca2": "sb",
    "calling-code": "677"
}, {
    "name": "Somalia",
    "cca2": "so",
    "calling-code": "252"
}, {
    "name": "South Africa",
    "cca2": "za",
    "calling-code": "27"
}, {
    "name": "South Korea",
    "cca2": "kr",
    "calling-code": "82"
}, {
    "name": "Spain",
    "cca2": "es",
    "calling-code": "34"
}, {
    "name": "Sri Lanka",
    "cca2": "lk",
    "calling-code": "94"
}, {
    "name": "Sudan",
    "cca2": "sd",
    "calling-code": "249"
}, {
    "name": "Suriname",
    "cca2": "sr",
    "calling-code": "597"
}, {
    "name": "Swaziland",
    "cca2": "sz",
    "calling-code": "268"
}, {
    "name": "Sweden",
    "cca2": "se",
    "calling-code": "46"
}, {
    "name": "Switzerland",
    "cca2": "ch",
    "calling-code": "41"
}, {
    "name": "Syrian Arab Republic",
    "cca2": "sy",
    "calling-code": "963"
}, {
    "name": "Taiwan, Province of China",
    "cca2": "tw",
    "calling-code": "886"
}, {
    "name": "Tajikistan",
    "cca2": "tj",
    "calling-code": "992"
}, {
    "name": "Tanzania",
    "cca2": "tz",
    "calling-code": "255"
}, {
    "name": "Thailand",
    "cca2": "th",
    "calling-code": "66"
}, {
    "name": "Timor-Leste",
    "cca2": "tl",
    "calling-code": "670"
}, {
    "name": "Togo",
    "cca2": "tg",
    "calling-code": "228"
}, {
    "name": "Tonga",
    "cca2": "to",
    "calling-code": "676"
}, {
    "name": "Trinidad and Tobago",
    "cca2": "tt",
    "calling-code": "1868"
}, {
    "name": "Tunisia",
    "cca2": "tn",
    "calling-code": "216"
}, {
    "name": "Turkey",
    "cca2": "tr",
    "calling-code": "90"
}, {
    "name": "Turkmenistan",
    "cca2": "tm",
    "calling-code": "993"
}, {
    "name": "Turks and Caicos Islands",
    "cca2": "tc",
    "calling-code": "1649"
}, {
    "name": "Tuvalu",
    "cca2": "tv",
    "calling-code": "688"
}, {
    "name": "Uganda",
    "cca2": "ug",
    "calling-code": "256"
}, {
    "name": "Ukraine",
    "cca2": "ua",
    "calling-code": "380"
}, {
    "name": "United Arab Emirates",
    "cca2": "ae",
    "calling-code": "971"
}, {
    "name": "United Kingdom",
    "cca2": "gb",
    "calling-code": "44"
}, {
    "name": "United States",
    "cca2": "us",
    "calling-code": "1"
}, {
    "name": "Uruguay",
    "cca2": "uy",
    "calling-code": "598"
}, {
    "name": "Uzbekistan",
    "cca2": "uz",
    "calling-code": "998"
}, {
    "name": "Vanuatu",
    "cca2": "vu",
    "calling-code": "678"
}, {
    "name": "Vatican City",
    "cca2": "va",
    "calling-code": "379"
}, {
    "name": "Venezuela",
    "cca2": "ve",
    "calling-code": "58"
}, {
    "name": "Viet Nam",
    "cca2": "vn",
    "calling-code": "84"
}, {
    "name": "Virgin Islands (British)",
    "cca2": "vg",
    "calling-code": "1284"
}, {
    "name": "Virgin Islands (U.S.)",
    "cca2": "vi",
    "calling-code": "1340"
}, {
    "name": "Western Sahara",
    "cca2": "eh",
    "calling-code": "212"
}, {
    "name": "Yemen",
    "cca2": "ye",
    "calling-code": "967"
}, {
    "name": "Zambia",
    "cca2": "zm",
    "calling-code": "260"
}, {
    "name": "Zimbabwe",
    "cca2": "zw",
    "calling-code": "263"
} ]
}

// Middleware's (usuario logueado, flash messages, fecha actual)
app.use(async (req, res, next) => {
    res.locals.usuario = { ...req.user } || null;
    res.locals.mensajes = req.flash();
    let paises = paisesJson
    res.locals.paises = paises;
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    res.locals.fecha = fecha.toLocaleString('es-CO');
    res.locals.moment = moment;
    res.locals.UrlDomain = req.hostname;
    next();
});

// habilitar bodyparser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas de la app
app.use('/', routes());

// Error 404
app.get('*', function (req, res) {
    res.status(404).render('404', {
        nombrePagina: 'Pagina no encontrada'
    })
});

// puerto
const puerto = process.env.PORT || 5001;
const server = app.listen(puerto, () => {
    console.log(`Corriendo correctamente en el puerto - ${puerto}`);
});

// // Socket
// const io = socketIO(server);

// // websockets
// io.on('connection', () => {
//     console.log('Nueva conexión');
// });
