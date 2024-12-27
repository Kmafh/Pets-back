// constants.js

// Constantes de la aplicación
const PORT = 3000;
const DB_HOST = "localhost";
const DB_USER = "root";
const DB_PASSWORD = "password";
const DB_NAME = "my_database";

const API_VERSION = "/api/v1";

// Mensajes o estados de error
const ERROR_MESSAGES = {
  NOT_FOUND: "Resource not found",
  SERVER_ERROR: "An unexpected error occurred",
};

const PLACAS = [
  {
    value: 1,
    pwString: "250W - 270W",
    pw: 260,
    tam: "1,7 m x 1,0 m",
    totalTam: 1.7,
    efiString: "14.7% y 15.8%",
    efi: 15,
    precio: 175,
  }, // Precio estimado en euros
  {
    value: 2,
    pwString: "300W - 330W",
    pw: 320,
    tam: "1,7 m x 1,0 m",
    totalTam: 1.7,
    efiString: "19.4%",
    efi: 19,
    precio: 225,
  },
  {
    value: 3,
    pwString: "340W - 370W",
    pw: 360,
    tam: "2,0 m x 1,0 m",
    totalTam: 2,
    efiString: "17% y 18.5%",
    efi: 18,
    precio: 275,
  },
  {
    value: 4,
    pwString: "400W - 450W",
    pw: 440,
    tam: "2,1 m x 1,0 m",
    totalTam: 2.1,
    efiString: "21-22%",
    efi: 22,
    precio: 325,
  },
  {
    value: 5,
    pwString: "500W - 550W",
    pw: 550,
    tam: "2,2 m x 1,1 m",
    totalTam: 2.42,
    efiString: "21-22%",
    efi: 22,
    precio: 375,
  },
  {
    value: 6,
    pwString: "600W - 700W",
    pw: 650,
    tam: "2,4 m x 1,2 m",
    totalTam: 2.88,
    efiString: "21-22%",
    efi: 22,
    precio: 450,
  },
];
const PLACAS_CAMPER = [
  {
    value: 1,
    pwString: "100W - 120W",
    pw: 110,
    tam: "1,2 m x 0,5 m",
    totalTam: 0.6,
    efiString: "18%",
    efi: 18,
    precio: 90,
  },
  {
    value: 2,
    pwString: "150W - 170W",
    pw: 160,
    tam: "1,3 m x 0,6 m",
    totalTam: 0.78,
    efiString: "18.5%",
    efi: 18.5,
    precio: 120,
  },
  {
    value: 3,
    pwString: "200W - 230W",
    pw: 215,
    tam: "1,4 m x 0.7 m",
    totalTam: 0.98,
    efiString: "19%",
    efi: 19,
    precio: 160,
  },
  {
    value: 4,
    pwString: "250W - 270W",
    pw: 260,
    tam: "1,5 m x 0.8 m",
    totalTam: 1.2,
    efiString: "20%",
    efi: 20,
    precio: 210,
  },
];

const PLACAS_PEQUENOS_CONSUMOS = [
  {
    value: 1,
    pwString: "5W - 10W",
    pw: 7.5,
    tam: "0.25 m x 0.20 m",
    totalTam: 0.05, // Tamaño en m²
    efiString: "17%",
    efi: 17,
    precio: 15, // Precio estimado en euros
  },
  {
    value: 2,
    pwString: "10W - 20W",
    pw: 15,
    tam: "0.3 m x 0.25 m",
    totalTam: 0.075,
    efiString: "17.5%",
    efi: 17.5,
    precio: 25,
  },
  {
    value: 3,
    pwString: "20W - 50W",
    pw: 35,
    tam: "0.5 m x 0.4 m",
    totalTam: 0.2,
    efiString: "18%",
    efi: 18,
    precio: 50,
  },
  {
    value: 4,
    pwString: "50W - 80W",
    pw: 65,
    tam: "0.7 m x 0.5 m",
    totalTam: 0.35,
    efiString: "18.5%",
    efi: 18.5,
    precio: 85,
  },
];

const PLACAS_GRANDES_CONSUMOS = [
    { 
      value: 1, 
      pwString: "400W - 450W", 
      pw: 440, 
      tam: "2,1 m x 1,0 m", 
      totalTam: 2.1, 
      efiString: "21-22%", 
      efi: 22, 
      precio: 325 
    },
    { 
      value: 2, 
      pwString: "500W - 550W", 
      pw: 550, 
      tam: "2,2 m x 1,1 m", 
      totalTam: 2.42, 
      efiString: "21-22%", 
      efi: 22, 
      precio: 375 
    },
    { 
      value: 3, 
      pwString: "600W - 700W", 
      pw: 650, 
      tam: "2,4 m x 1,2 m", 
      totalTam: 2.88, 
      efiString: "21-22%", 
      efi: 22, 
      precio: 450 
    },
    { 
      value: 4, 
      pwString: "800W - 900W", 
      pw: 850, 
      tam: "2,5 m x 1,3 m", 
      totalTam: 3.25, 
      efiString: "22-24%", 
      efi: 24, 
      precio: 550 
    }
  ];
  
const BATTERY = [
  { name: "Batería A", capacidadKWh: 1.2, precio: 125 }, // Precio estimado en euros
  { name: "Batería B", capacidadKWh: 4.8, precio: 350 },
  { name: "Batería C", capacidadKWh: 4.8, precio: 350 },
  { name: "Batería D", capacidadKWh: 7.2, precio: 550 },
  { name: "Batería E", capacidadKWh: 9.6, precio: 750 },
];
const BATTERY_CAMPER = [
  { name: "Batería AGM 100Ah", capacidadKWh: 1.2, precio: 200 }, // Capacidad en kWh y precio en euros
  { name: "Batería AGM 150Ah", capacidadKWh: 1.8, precio: 300 },
  { name: "Batería de Litio 100Ah", capacidadKWh: 1.3, precio: 500 },
  { name: "Batería de Litio 150Ah", capacidadKWh: 2.0, precio: 750 },
  { name: "Batería de Gel 120Ah", capacidadKWh: 1.4, precio: 350 },
];

const BATERY_PEQUENOS_CONSUMOS = [
    { 
      value: 1, 
      name: "Batería 5Ah", 
      capacidadKWh: 0.06,  // Capacidad en kWh (5 Ah * 12V / 1000)
      tipo: "Plomo-ácido", 
      voltaje: 12, 
      amperiosHora: 5, 
      precio: 20  // Precio estimado en euros
    },
    { 
      value: 2, 
      name: "Batería 10Ah", 
      capacidadKWh: 0.12,  // 10 Ah * 12V / 1000
      tipo: "Plomo-ácido", 
      voltaje: 12, 
      amperiosHora: 10, 
      precio: 35
    },
    { 
      value: 3, 
      name: "Batería 20Ah", 
      capacidadKWh: 0.24,  // 20 Ah * 12V / 1000
      tipo: "Plomo-ácido", 
      voltaje: 12, 
      amperiosHora: 20, 
      precio: 60
    },
    { 
      value: 4, 
      name: "Batería 40Ah", 
      capacidadKWh: 0.48,  // 40 Ah * 12V / 1000
      tipo: "Plomo-ácido", 
      voltaje: 12, 
      amperiosHora: 40, 
      precio: 100
    }
  ];
  const BATERY_GRANDES_CONSUMOS = [
    { 
      value: 1, 
      name: "Batería 100Ah", 
      capacidadKWh: 1.2,  // Capacidad en kWh (100 Ah * 12V / 1000)
      tipo: "Plomo-ácido", 
      voltaje: 12, 
      amperiosHora: 100, 
      precio: 250 
    },
    { 
      value: 2, 
      name: "Batería 200Ah", 
      capacidadKWh: 2.4,  // 200 Ah * 12V / 1000
      tipo: "Plomo-ácido", 
      voltaje: 12, 
      amperiosHora: 200, 
      precio: 450 
    },
    { 
      value: 3, 
      name: "Batería 300Ah", 
      capacidadKWh: 3.6,  // 300 Ah * 12V / 1000
      tipo: "Plomo-ácido", 
      voltaje: 12, 
      amperiosHora: 300, 
      precio: 650 
    },
    { 
      value: 4, 
      name: "Batería 400Ah", 
      capacidadKWh: 4.8,  // 400 Ah * 12V / 1000
      tipo: "Plomo-ácido", 
      voltaje: 12, 
      amperiosHora: 400, 
      precio: 850 
    }
  ];
  
const OTROS = [
  { name: "Inversor", capacidad: "5 kW", precio: 800 }, // Precio estimado en euros
  { name: "Regulador de carga", capacidad: "30 A", precio: 150 },
  { name: "Estructuras de montaje", tipo: "Techo", precio: 200 },
  { name: "Cables y conectores", tipo: "Kit completo", precio: 100 },
  { name: "Caja de conexiones", tipo: "Protección y organización", precio: 75 },
  { name: "Sistema de monitoreo", tipo: "Base", precio: 250 },
];
const UBICACION = [
  { id: 1, region: "Ávila", irradiacion: 4.55 },
  { id: 2, region: "Badajoz", irradiacion: 5.0 },
  { id: 3, region: "Barcelona", irradiacion: 4.74 },
  { id: 4, region: "Burgos", irradiacion: 4.35 },
  { id: 5, region: "Cáceres", irradiacion: 5.05 },
  { id: 6, region: "Cádiz", irradiacion: 5.05 },
  { id: 7, region: "Castellón", irradiacion: 4.95 },
  { id: 8, region: "Ciudad Real", irradiacion: 5.1 },
  { id: 9, region: "Córdoba", irradiacion: 5.18 },
  { id: 10, region: "La Coruña", irradiacion: 3.58 },
  { id: 11, region: "Cuenca", irradiacion: 4.6 },
  { id: 12, region: "Girona", irradiacion: 4.72 },
  { id: 13, region: "Granada", irradiacion: 5.11 },
  { id: 14, region: "Guadalajara", irradiacion: 4.7 },
  { id: 15, region: "Gipuzkoa", irradiacion: 3.85 },
  { id: 16, region: "Huelva", irradiacion: 5.1 },
  { id: 17, region: "Huesca", irradiacion: 4.65 },
  { id: 18, region: "Jaén", irradiacion: 5.2 },
  { id: 19, region: "La Rioja", irradiacion: 4.5 },
  { id: 20, region: "Las Palmas", irradiacion: 5.6 },
  { id: 21, region: "León", irradiacion: 4.25 },
  { id: 22, region: "Lérida", irradiacion: 4.75 },
  { id: 23, region: "Lugo", irradiacion: 3.75 },
  { id: 24, region: "Madrid", irradiacion: 4.67 },
  { id: 25, region: "Málaga", irradiacion: 5.38 },
  { id: 26, region: "Murcia", irradiacion: 5.32 },
  { id: 27, region: "Navarra", irradiacion: 4.2 },
  { id: 28, region: "Ourense", irradiacion: 3.85 },
  { id: 29, region: "Palencia", irradiacion: 4.4 },
  { id: 30, region: "Pontevedra", irradiacion: 3.85 },
  { id: 31, region: "Salamanca", irradiacion: 4.25 },
  { id: 32, region: "Segovia", irradiacion: 4.45 },
  { id: 33, region: "Sevilla", irradiacion: 5.21 },
  { id: 34, region: "Soria", irradiacion: 4.35 },
  { id: 35, region: "Tarragona", irradiacion: 4.85 },
  { id: 36, region: "Teruel", irradiacion: 4.55 },
  { id: 37, region: "Toledo", irradiacion: 5.0 },
  { id: 38, region: "Valencia", irradiacion: 5.0 },
  { id: 39, region: "Valladolid", irradiacion: 4.44 },
  { id: 40, region: "Vizcaya", irradiacion: 3.85 },
  { id: 41, region: "Zamora", irradiacion: 4.3 },
  { id: 42, region: "Zaragoza", irradiacion: 4.9 },
  { id: 43, region: "Ceuta", irradiacion: 5.25 },
  { id: 44, region: "Melilla", irradiacion: 5.3 },
  { id: 45, region: "Albacete", irradiacion: 5.15 },
  { id: 46, region: "Almería", irradiacion: 5.39 },
  { id: 47, region: "Alicante", irradiacion: 5.15 },
  { id: 48, region: "Barcelona", irradiacion: 4.74 },
  { id: 49, region: "Bilbao", irradiacion: 3.79 },
  { id: 50, region: "Lérida", irradiacion: 4.75 },
];

// Exportar las constantes
module.exports = {
  PORT,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  API_VERSION,
  ERROR_MESSAGES,
  PLACAS,
  BATTERY,
  UBICACION,
  OTROS,
  PLACAS_CAMPER,
  BATTERY_CAMPER,
  BATERY_PEQUENOS_CONSUMOS,
  PLACAS_PEQUENOS_CONSUMOS,
  BATERY_GRANDES_CONSUMOS,
  PLACAS_GRANDES_CONSUMOS
};
