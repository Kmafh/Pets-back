const { response } = require("express");

const Feedback = require("../feedback/model");
const User = require("../user/model");
const Solicitud = require("../solicitud/model");
const Notification = require("../notifications/model");
const Favorite = require("../favorite/model");
const Comment = require("../comments/model");

const { generarJWT } = require("../helpers/jwt");

const getFeedbacksAll = async (req, res) => {
  try {
    const [feedbacks] = await Promise.all([Feedback.find({ active: true })]);
    const feedbacksWithFavorites = await Promise.all(
      feedbacks.map(async (feedback) => {
        const totalFavorites = await Favorite.countDocuments({
          reciveId: feedback.id,
          tipe: "feedback",
        });
        return {
          ...feedback.toObject(), // Convierte el documento a un objeto plano
          favorites: totalFavorites, // Agrega el nuevo campo "favorites"
        };
      })
    );
    const feedbacksWithFavoritesAndUser = await Promise.all(
      feedbacksWithFavorites.map(async (feedbackt) => {
        const user = await User.findOne({
          _id: feedbackt.uid,
        });
        return {
          ...feedbackt, // Convierte el documento a un objeto plano
          user: user,
        };
      })
    );
    res.json({
      ok: true,
      feedbacks: feedbacksWithFavoritesAndUser,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: true,
      msg: "Hable con el administrador",
    });
  }
};
const getFeedbacks = async (req, res) => {
  const uid = req.params.uid;

  try {
    const [feedbacks] = await Promise.all([
      Feedback.find({ active: true, uid }), // Obtén todas las mascotas activas del usuario
    ]);

    // Itera sobre cada mascota y asocia las solicitudes correspondientes
    const feedbacksConSolicitudes = await Promise.all(
      feedbacks.map(async (feedback) => {
        const solicitudes = await Solicitud.find({
          feedbackId: feedback.id,
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
          ...feedback._doc, // Datos de la mascota
          solicitudes: solicitudesConUsuarios, // Solicitudes con usuarios
        };
      })
    );
    const [notification] = await Promise.all([
      Notification.find({ uid }).sort({ createAt: 1 }),
    ]);
    // / Añadir el parámetro `img` a cada notificación
    const notificationsWithImg = notification.map((notification) => {
      const feedback = feedbacks.find((p) => p._id.toString() === notification.feedbackId); // Supongamos que tienes un campo feedbackId en las notificaciones
      return {
        ...notification.toObject(), // Convertimos el documento a objeto simple
        img: feedback ? feedback.images : null, // Añadimos la imagen si existe
      };
    });
    const [favoritesFeedbacks] = await Promise.all([
      Favorite.find({ active: true, uid, tipe: "feedback" }), // Obtén todas las mascotas activas del usuario
    ]);
    const [favoritesProtected] = await Promise.all([
      Favorite.find({ active: true, uid, tipe: "protected" }), // Obtén todas las mascotas activas del usuario
    ]);
    const feedbackFavoritesFeedbacks = await Promise.all(
      favoritesFeedbacks.map(async (favorite) => {
        // Encuentra la mascota asociada al reciveId del favorito y selecciona solo los campos necesarios
        const feedback = await Feedback.findOne({ _id: favorite.reciveId }).select(
          "images name country"
        );

        // Combina los datos del favorito y los campos específicos del feedback
        return {
          ...favorite._doc, // Datos del favorito
          ...feedback?._doc, // Solo añade los campos img, name, y country del feedback
        };
      })
    );
    const protectedFavoritesPro = await Promise.all(
      favoritesProtected.map(async (favorite) => {
        // Encuentra la mascota asociada al reciveId del favorito y selecciona solo los campos necesarios
        const user = await User.findOne({ _id: favorite.reciveId }).select(
          "img name lastname country"
        );

        // Combina los datos del favorito y los campos específicos del feedback
        return {
          ...favorite._doc, // Datos del favorito
          ...user?._doc, // Solo añade los campos img, name, y country del feedback
        };
      })
    );
    // Estructura de datos a enviar
    const data = {
      feedbacks: feedbacksConSolicitudes,
      notification: notificationsWithImg,
      feedbackFav: feedbackFavoritesFeedbacks,
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

const getFeedback = async (req, res = response) => {
  // TODO: Validar token y comprobar si es el feedback correcto
  const id = req.params.id;
  try {
    const feedbackDB = await Feedback.findById({ _id: id });
    if (!feedbackDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un feedback por ese id",
      });
    }
    const feedback = await Feedback.findById(id);
    const user = await User.findOne({ _id: feedback.uid });
    const solicitud = await Solicitud.find({ feedbackId: feedback.id, active: true });
    const favorite = await Favorite.find({
      tipe: "feedback",
      reciveId: feedback.id,
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

    const data = { feedback, user, solicitud: solicitudesConUsuarios, favorite };
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

const crearFeedback = async (req, res = response) => {
  try {
    const feedback = new Feedback(req.body);
    // Guardar feedback
    await feedback.save();
    res.json({
      ok: true,
      feedback,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado... revisar logs",
    });
  }
};

const actualizarFeedback = async (req, res = response) => {
  // TODO: Validar token y comprobar si es el feedback correcto
  const uid = req.params.id;
  try {
    const feedbackDB = await Feedback.findById(uid);
    if (!feedbackDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un feedback por ese id",
      });
    }
    // Actualizaciones
    const { ...campos } = req.body;

    const feedbackActualizado = await Feedback.findByIdAndUpdate(uid, campos, {
      new: true,
    });
    res.json({
      ok: true,
      feedback: feedbackActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const adoptarFeedback = async (req, res = response) => {
  // TODO: Validar token y comprobar si es el feedback correcto
  const uid = req.params.id;
  try {
    const feedbackDB = await Feedback.findById(uid);
    if (!feedbackDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un feedback por ese id",
      });
    }
    // Actualizaciones
    const { ...campos } = req.body;
    const feedbackActualizado = await Feedback.findByIdAndUpdate(uid, campos, {
      new: true,
    });
    if (feedbackActualizado) {
      // Buscar y actualizar las solicitudes con el feedbackId correspondiente
      await Solicitud.updateMany(
        { feedbackId: feedbackActualizado._id }, // Condición: solicitudes con el feedbackId igual al de la mascota actualizada
        { $set: { active: false } } // Actualización: cambiar active a false
      );
    }
    res.json({
      ok: true,
      feedback: feedbackActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const borrarFeedback = async (req, res = response) => {
  const uid = req.params.id;
  try {
    const feedbackDB = await Feedback.findById(uid);
    if (!feedbackDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un feedback por ese id",
      });
    }
    await Feedback.findByIdAndDelete(uid);
    res.json({
      ok: true,
      msg: "Feedback eliminado",
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
  getFeedbacks,
  crearFeedback,
  actualizarFeedback,
  borrarFeedback,
  getFeedback,
  getFeedbacksAll,
  adoptarFeedback,
};
