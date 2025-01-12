const { response } = require("express");

const Pet = require("../pet/model");
const User = require("../user/model");
const Solicitud = require("../solicitud/model");
const Notification = require("../notifications/model");
const Favorite = require("../favorite/model");
const Feedback = require("../feedback/model");

const { generarJWT } = require("../helpers/jwt");

const getPetsAll = async (req, res) => {
  try {
    const [pets] = await Promise.all([Pet.find({ active: true })]);
    const petsWithFavorites = await Promise.all(
      pets.map(async (pet) => {
        const totalFavorites = await Favorite.countDocuments({
          reciveId: pet.id,
          tipe: "pet",
        });
        return {
          ...pet.toObject(), // Convierte el documento a un objeto plano
          favorites: totalFavorites, // Agrega el nuevo campo "favorites"
        };
      })
    );
    const petsWithFavoritesAndUser = await Promise.all(
      petsWithFavorites.map(async (pett) => {
        const user = await User.findOne({
          _id: pett.uid,
        });
        return {
          ...pett, // Convierte el documento a un objeto plano
          user: user,
        };
      })
    );
    res.json({
      ok: true,
      pets: petsWithFavoritesAndUser,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: true,
      msg: "Hable con el administrador",
    });
  }
};
const getPets = async (req, res) => {
  const uid = req.params.uid;

  try {
    const [pets] = await Promise.all([
      Pet.find({ active: true, uid }), // Obtén todas las mascotas activas del usuario
    ]);

    // Itera sobre cada mascota y asocia las solicitudes correspondientes
    const petsConSolicitudes = await Promise.all(
      pets.map(async (pet) => {
        const solicitudes = await Solicitud.find({
          petId: pet.id,
          active: true,
        });

        // Para cada solicitud, agrega el usuario correspondiente
        const solicitudesConUsuarios = await Promise.all(
          solicitudes.map(async (solicitud) => {
            const user = await User.findById(solicitud.uid).select(
              "name lastname email img"
            );
            return {
              ...solicitud._doc, // Datos de la solicitud
              user, // Datos del usuario
            };
          })
        );

        // Retorna la mascota con sus solicitudes
        return {
          ...pet._doc, // Datos de la mascota
          solicitudes: solicitudesConUsuarios, // Solicitudes con usuarios
        };
      })
    );
    const [notification] = await Promise.all([
      Notification.find({ uid }).sort({ createAt: 1 }),
    ]);
    // / Añadir el parámetro `img` a cada notificación
    const notificationsWithImg = await Promise.all(
      notification.map(async (notification) => {
        const pet = pets.find((p) => p._id.toString() === notification.petId); // Supongamos que tienes un campo petId en las notificaciones
        const solicitud = await Solicitud.findById({ _id: notification.sid });
    
        let solicitudWithUser = null;
    
        if (solicitud) {
          const user = await User.findById({ _id: solicitud.uid }).select(
            "name lastname email img"
          );
          solicitudWithUser = {
            ...solicitud.toObject(), // Convertimos a objeto plano
            user, // Añadimos el usuario
          };
        }
    
        return {
          ...notification.toObject(), // Convertimos el documento de la notificación a objeto plano
          pet,
          solicitud: solicitudWithUser, // Usamos el objeto modificado
        };
      })
    );
    
    const [favoritesPets] = await Promise.all([
      Favorite.find({ active: true, uid, tipe: "pet" }), // Obtén todas las mascotas activas del usuario
    ]);
    const [favoritesProtected] = await Promise.all([
      Favorite.find({ active: true, uid, tipe: "protected" }), // Obtén todas las mascotas activas del usuario
    ]);
    const petFavoritesPets = await Promise.all(
      favoritesPets.map(async (favorite) => {
        // Encuentra la mascota asociada al reciveId del favorito y selecciona solo los campos necesarios
        const pet = await Pet.findOne({ _id: favorite.reciveId }).select(
          "images name country"
        );

        // Combina los datos del favorito y los campos específicos del pet
        return {
          ...favorite._doc, // Datos del favorito
          ...pet?._doc, // Solo añade los campos img, name, y country del pet
        };
      })
    );
    const protectedFavoritesPro = await Promise.all(
      favoritesProtected.map(async (favorite) => {
        // Encuentra la mascota asociada al reciveId del favorito y selecciona solo los campos necesarios
        const user = await User.findOne({ _id: favorite.reciveId }).select(
          "img name lastname country"
        );

        // Combina los datos del favorito y los campos específicos del pet
        return {
          ...favorite._doc, // Datos del favorito
          ...user?._doc, // Solo añade los campos img, name, y country del pet
        };
      })
    );
    // Estructura de datos a enviar
    const data = {
      pets: petsConSolicitudes,
      notification: notificationsWithImg,
      petFav: petFavoritesPets,
      proFav: protectedFavoritesPro,
    };

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

const getPet = async (req, res = response) => {
  // TODO: Validar token y comprobar si es el pet correcto
  const id = req.params.id;
  try {
    const petDB = await Pet.findById({ _id: id });
    if (!petDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un pet por ese id",
      });
    }
    const pet = await Pet.findById(id);
    const user = await User.findOne({ _id: pet.uid });
    const solicitud = await Solicitud.find({ petId: pet.id, active: true });
    const favorite = await Favorite.find({
      tipe: "pet",
      reciveId: pet.id,
      active: true,
    });

    const solicitudesConUsuarios = await Promise.all(
      solicitud.map(async (solicitud) => {
        const user = await User.findById(solicitud.uid).select(
          "name lastname email img"
        ); // Trae solo los campos necesarios
        return {
          ...solicitud._doc, // Incluye los datos originales de la solicitud
          user, // Agrega los datos del usuario
        };
      })
    );
// Obtener el total de puntos de todos los feedback relacionados con el usuario
    const totalPoints = await Feedback.aggregate([
      { $match: { toId: user.uid } }, // Filtra los feedbacks donde toId es igual a user.uid
      { $group: { _id: null, totalPoints: { $sum: "$points" } } }, // Suma los puntos de todos los feedbacks
    ]);

    // Si hay feedbacks, el campo totalPoints tendrá el valor, si no, será 0
    const valore =
      totalPoints.length > 0 ? totalPoints[0].totalPoints : 0;

    const data = { pet, user, solicitud: solicitudesConUsuarios, favorite,valore };
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

const crearPet = async (req, res = response) => {
  try {
    const pet = new Pet(req.body);
    // Guardar pet
    await pet.save();
    res.json({
      ok: true,
      pet,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado... revisar logs",
    });
  }
};

const actualizarPet = async (req, res = response) => {
  // TODO: Validar token y comprobar si es el pet correcto
  const uid = req.params.id;
  try {
    const petDB = await Pet.findById(uid);
    if (!petDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un pet por ese id",
      });
    }
    // Actualizaciones
    const { ...campos } = req.body;

    const petActualizado = await Pet.findByIdAndUpdate(uid, campos, {
      new: true,
    });
    res.json({
      ok: true,
      pet: petActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const adoptarPet = async (req, res = response) => {
  // TODO: Validar token y comprobar si es el pet correcto
  const uid = req.params.id;
  try {
    const petDB = await Pet.findById(uid);
    if (!petDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un pet por ese id",
      });
    }
    // Actualizaciones
    const { ...campos } = req.body;
    const petActualizado = await Pet.findByIdAndUpdate(uid, campos, {
      new: true,
    });
    if (petActualizado) {
      // Buscar y actualizar las solicitudes con el petId correspondiente
      await Solicitud.updateMany(
        { petId: petActualizado._id }, // Condición: solicitudes con el petId igual al de la mascota actualizada
        { $set: { active: false } } // Actualización: cambiar active a false
      );
    }
    res.json({
      ok: true,
      pet: petActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const borrarPet = async (req, res = response) => {
  const uid = req.params.id;
  try {
    const petDB = await Pet.findById(uid);
    if (!petDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un pet por ese id",
      });
    }
    await Pet.findByIdAndDelete(uid);
    res.json({
      ok: true,
      msg: "Pet eliminado",
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
  getPets,
  crearPet,
  actualizarPet,
  borrarPet,
  getPet,
  getPetsAll,
  adoptarPet,
};
