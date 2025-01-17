const { response } = require("express");
const bcrypt = require("bcryptjs");

const Favorite = require("../favorite/model");
const Feedback = require("../feedback/model");
const User = require("../user/model");
const Pet = require("../pet/model");
const Solicitud = require("../solicitud/model");
const Notification = require("../notifications/model");
const { generarJWT } = require("../helpers/jwt");

const getUsers = async (req, res) => {
  const desde = Number(req.query.desde) || 0;

  try {
    const [usuarios, total] = await Promise.all([
      User.find(
        { active: true },
        "name email lastname img rol createAt city country"
      )
        .skip(desde)
        .limit(5),

      User.countDocuments(),
    ]);

    res.json({
      ok: true,
      usuarios,
      total,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: true,
      msg: "Hable con el administrador",
    });
  }
};
const getUsersProtected = async (req, res = response) => {
  const desde = Number(req.query.desde) || 0;

  try {
    const [usuarios] = await Promise.all([
      User.find(
        { active: true, tipe: "1" },
        " tipe name email lastname img rol createAt city country"
      ),
    ]);

    res.json({
      ok: true,
      protected: usuarios,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: true,
      msg: "Hable con el administrador",
    });
  }
};
const getUser = async (req, res = response) => {
  const uid = req.params.id;
  let notificationsWithImg = null;
  let solicitudWithPetAndUsers = null;
  let solicitudRecibida = null;

  try {
    const usuarioDB = await User.findById(uid).lean();
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario por ese id",
      });
    }

    const favorites = await Favorite.find({ uid }).lean();
    const favoritesWithData = await Promise.all(
      favorites.map(async (favorite) => {
        const pet = await Pet.findById(favorite.reciveId).lean();
        const protected = await User.findById(favorite.reciveId).lean();
        return {
          ...pet,
          ...protected,
        };
      })
    );

    const totalPoints = await Feedback.aggregate([
      { $match: { toId: usuarioDB._id } },
      { $group: { _id: null, totalPoints: { $sum: "$points" } } },
    ]);
    const valore = totalPoints.length > 0 ? totalPoints[0].totalPoints : 0;

    const pets = await Pet.find({ active: true, uid }).lean();

    // Obtener solicitudes recibidas (todas las solicitudes asociadas a las mascotas del usuario)
    const solicitudRecibidaRaw = await Solicitud.find({
      petId: { $in: pets.map((pet) => pet._id) },
    }).lean();

    solicitudRecibida = await Promise.all(
      solicitudRecibidaRaw.map(async (sol) => {
        const user = await User.findById(sol.uid)
          .select("name lastname email img")
          .lean();
        const pet = pets.find((p) => p._id.equals(sol.petId));
        return { ...sol, user, pet };
      })
    );

    const notification = await Notification.find({ uid })
      .sort({ createAt: 1 })
      .lean();
    if (notification) {
      notificationsWithImg = await Promise.all(
        notification.map(async (notif) => {
          const pet = await Pet.findById(notif.petId).lean();
          const solicitud = await Solicitud.findById(notif.sid);
          let user = null;
          if (solicitud) {
            user = await User.findById(solicitud.uid)
              .select("name lastname email img")
              .lean();
          }

          return {
            ...notif,
            pet,
            solicitud,
            user,
          };
        })
      );
    }

    const solicitud = await Solicitud.find({ uid })
      .sort({ createAt: 1 })
      .lean();
    if (solicitud) {
      solicitudWithPetAndUsers = await Promise.all(
        solicitud.map(async (resp) => {
          if (resp) {
            const user = await User.findById(resp.uid)
              .select("name lastname email img")
              .lean();
            const pet = await Pet.findById(resp.petId).lean();
            return {
              ...resp,
              user,
              pet,
            };
          }
        })
      );
    }

    res.json({
      ok: true,
      user: usuarioDB || null,
      favorites: favoritesWithData || null,
      valore,
      pets, // Mascotas del usuario
      notification: notificationsWithImg || null,
      solicitudes: solicitudWithPetAndUsers || null, // Solicitudes enviadas
      solicitudRecibida: solicitudRecibida || null, // Solicitudes recibidas asociadas a las mascotas
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};



const crearUser = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const existeEmail = await User.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya está registrado",
      });
    }
    const usuario = new User(req.body);
    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);
    usuario.active = true;
    // Guardar usuario
    await usuario.save();
    // Generar el TOKEN - JWT
    const token = await generarJWT(usuario.id);
    res.json({
      ok: true,
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado... revisar logs",
    });
  }
};

const actualizarUser = async (req, res = response) => {
  // TODO: Validar token y comprobar si es el usuario correcto
  const uid = req.params.id;
  try {
    const usuarioDB = await User.findById(uid);
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario por ese id",
      });
    }
    // Actualizaciones
    const { password, google, email, ...campos } = req.body;
    if (usuarioDB.email !== email) {
      const existeEmail = await User.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe un usuario con ese email",
        });
      }
    }
    if (!usuarioDB.google) {
      campos.email = email;
    } else if (usuarioDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: "User de google no pueden cambiar su correo",
      });
    }
    const usuarioActualizado = await User.findByIdAndUpdate(uid, campos, {
      new: true,
    });
    res.json({
      ok: true,
      user: usuarioActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const borrarUser = async (req, res = response) => {
  const uid = req.params.id;
  try {
    const usuarioDB = await User.findById(uid);
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario por ese id",
      });
    }
    await User.findByIdAndDelete(uid);
    res.json({
      ok: true,
      msg: "User eliminado",
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
  getUsers,
  crearUser,
  actualizarUser,
  borrarUser,
  getUser,
  getUsersProtected,
};
