const { response } = require("express");

const Comment = require("../comment/model");
const User = require("../user/model");
const Solicitud = require("../solicitud/model");
const Notification = require("../notifications/model");
const Favorite = require("../favorite/model");

const getCommentsAll = async (req, res) => {
  try {
    const [comments] = await Promise.all([Comment.find({ active: true })]);

    res.json({
      ok: true,
      comments,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: true,
      msg: "Hable con el administrador",
    });
  }
};
const getComments = async (req, res) => {
  const uid = req.params.uid;

  try {
    const [comments] = await Promise.all([
      Comment.find({
        active: true,
        $or: [{ emisorId: uid }, { receptorId: uid }],
      }), // Obtén todas las mascotas activas del usuario
    ]);
    // Obtener los IDs únicos de los usuarios a buscar
    const userIds = [
      ...new Set([
        ...comments.map((comment) => comment.emisorId.toString()),
        ...comments.map((comment) => comment.receptorId.toString()),
      ]),
    ];

    // Consultar los usuarios por sus IDs
    const users = await User.find({ _id: { $in: userIds } });

    // Crear un mapa para acceder a los datos de usuario más rápido
    const userMap = users.reduce((map, user) => {
      map[user._id] = user;
      return map;
    }, {});

    // Añadir los datos de usuario a cada comentario
    const commentsWithUsers = comments.map((comment) => ({
      ...comment.toObject(),
      emisorId: userMap[comment.emisorId],
      receptorId: userMap[comment.receptorId],
    }));

    // Estructura de datos a enviar
    const data = {
      comments: commentsWithUsers,
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

const getComment = async (req, res = response) => {
  // TODO: Validar token y comprobar si es el comment correcto
  const id = req.params.id;
  try {
    const commentDB = await Comment.findById({ _id: id });
    if (!commentDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un comment por ese id",
      });
    }
    const comment = await Comment.findById(id);
    const user = await User.findOne({ _id: comment.uid });
    const solicitud = await Solicitud.find({
      commentId: comment.id,
      active: true,
    });
    const favorite = await Favorite.find({
      tipe: "comment",
      reciveId: comment.id,
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
    const data = { comment, user, solicitud: solicitudesConUsuarios, favorite };
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

const crearComment = async (req, res = response) => {
  try {
    const comment = new Comment(req.body);
    // Guardar comment
    await comment.save();
    res.json({
      ok: true,
      comment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado... revisar logs",
    });
  }
};

const actualizarComment = async (req, res = response) => {
  // TODO: Validar token y comprobar si es el comment correcto
  const uid = req.params.id;
  try {
    const commentDB = await Comment.findById(uid);
    if (!commentDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un comment por ese id",
      });
    }
    // Actualizaciones
    const { password, google, email, ...campos } = req.body;
    if (commentDB.email !== email) {
      const existeEmail = await Comment.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe un comment con ese email",
        });
      }
    }
    if (!commentDB.google) {
      campos.email = email;
    } else if (commentDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: "Comment de google no pueden cambiar su correo",
      });
    }
    const commentActualizado = await Comment.findByIdAndUpdate(uid, campos, {
      new: true,
    });
    res.json({
      ok: true,
      comment: commentActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const borrarComment = async (req, res = response) => {
  const uid = req.params.id;
  try {
    const commentDB = await Comment.findById(uid);
    if (!commentDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un comment por ese id",
      });
    }
    await Comment.findByIdAndDelete(uid);
    res.json({
      ok: true,
      msg: "Comment eliminado",
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
  getComments,
  crearComment,
  actualizarComment,
  borrarComment,
  getComment,
  getCommentsAll,
};
