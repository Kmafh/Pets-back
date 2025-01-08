const { response } = require("express");

const Favorite = require("../favorite/model");
const User = require("../user/model");
const Solicitud = require("../solicitud/model");
const Notification = require("../notifications/model");

const { generarJWT } = require("../helpers/jwt");

const getFavoritesAll = async (req, res) => {
  try {
    const [favorites] = await Promise.all([Favorite.find({ active: true })]);

    res.json({
      ok: true,
      favorites,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: true,
      msg: "Hable con el administrador",
    });
  }
};
const getFavorites = async (req, res) => {
  const uid = req.params.uid;

  try {
    const [favoritesPets] = await Promise.all([
      Favorite.find({ active: true, uid, tipe: "pet" }), // Obtén todas las mascotas activas del usuario
    ]);
    const [favoritesProtected] = await Promise.all([
      Favorite.find({ active: true, uid, tipe: "protected" }), // Obtén todas las mascotas activas del usuario
    ]);
    // Itera sobre cada mascota y asocia las solicitudes correspondientes
    const petFavoritesPets = await Promise.all(
      favorites.map(async (favorite) => {
        const pets = await Solicitud.find({ id: favorite.reciveId });

        // Para cada solicitud, agrega el usuario correspondiente
        const userPet = await Promise.all(
          pets.map(async (pet) => {
            const user = await User.findById(solicitud.uid).select(
              "name email img"
            );
            return {
              ...pet._doc, // Datos de la solicitud
              user, // Datos del usuario
            };
          })
        );

        // Retorna la mascota con sus solicitudes
        return {
          ...favorite._doc, // Datos de la mascota
          pets: userPet, // Solicitudes con usuarios
        };
      })
    );
    // Estructura de datos a enviar
    const data = { pets:petFavoritesPets, notification };

    res.json({
      ok: true,
      data,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: true,
      msg: "Hable con el administrador",
    });
  }
};

const getFavorite = async (req, res = response) => {
  // TODO: Validar token y comprobar si es el favorite correcto
  const id = req.params.id;
  try {
    const favoriteDB = await Favorite.findById({ _id: id });
    if (!favoriteDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un favorite por ese id",
      });
    }
    const favorite = await Favorite.findById(id);
    const user = await User.findOne({ _id: favorite.uid });
    const solicitud = await Solicitud.find({
      favoriteId: favorite.id,
      active: true,
    });
    const solicitudesConUsuarios = await Promise.all(
      solicitud.map(async (solicitud) => {
        const user = await User.findById(solicitud.uid).select(
          "name email img"
        ); // Trae solo los campos necesarios
        return {
          ...solicitud._doc, // Incluye los datos originales de la solicitud
          user, // Agrega los datos del usuario
        };
      })
    );
    const data = { favorite, user, solicitud: solicitudesConUsuarios };
    res.json({
      ok: true,
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const crearFavorite = async (req, res = response) => {
  try {
    const favorite = new Favorite(req.body);
    // Guardar favorite
    await favorite.save();
    res.json({
      ok: true,
      favorite,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado... revisar logs",
    });
  }
};

const actualizarFavorite = async (req, res = response) => {
  // TODO: Validar token y comprobar si es el favorite correcto
  const uid = req.params.id;
  try {
    const favoriteDB = await Favorite.findById(uid);
    if (!favoriteDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un favorite por ese id",
      });
    }
    // Actualizaciones
    const { password, google, email, ...campos } = req.body;
    if (favoriteDB.email !== email) {
      const existeEmail = await Favorite.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe un favorite con ese email",
        });
      }
    }
    if (!favoriteDB.google) {
      campos.email = email;
    } else if (favoriteDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: "Favorite de google no pueden cambiar su correo",
      });
    }
    const favoriteActualizado = await Favorite.findByIdAndUpdate(uid, campos, {
      new: true,
    });
    res.json({
      ok: true,
      favorite: favoriteActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const borrarFavorite = async (req, res = response) => {
  const uid = req.params.id;
  try {
    const favoriteDB = await Favorite.findById(uid);
    if (!favoriteDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un favorite por ese id",
      });
    }
    await Favorite.findByIdAndDelete(uid);
    res.json({
      ok: true,
      msg: "Favorite eliminado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getFavorites,
  crearFavorite,
  actualizarFavorite,
  borrarFavorite,
  getFavorite,
  getFavoritesAll,
};
