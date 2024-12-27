const Usuario = require('../models/usuario');
const Artwork = require('../models/artwork');
const fs = require('fs');


const borrarImagen = ( path ) => {
    if ( fs.existsSync( path ) && path !=='./uploads/incomes/' ) {
        // borrar la imagen anterior
        fs.unlinkSync( path );
    }
}

const actualizarImagen = async(tipo, id, nameArchivo) => {
    let pathViejo = '';
    switch( tipo ) {
        case 'artwork':
            const artwork = await Artwork.findById(id);
            
            if ( !artwork ) {
                console.log('No es un médico por id');
                return false;
            }
            pathViejo = `./uploads/artwork/${ artwork.img }`;
            if(artwork.img) {
                borrarImagen( pathViejo );
            }
            artwork.img = nameArchivo;
            await artwork.save();
            return true;
        break;
        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if ( !usuario ) {
                console.log('No es un usuario por id');
                return false;
            }
            if(usuario.img !== "perfil.png"){
                pathViejo = `./uploads/usuarios/${ usuario.img }`;
                borrarImagen( pathViejo );
            }
            usuario.img = nameArchivo;
            await usuario.save();
            return true;
        break;
        case 'fondo':
        const user = await Usuario.findById(id);
        if ( !user ) {
            console.log('No es un usuario por id');
            return false;
        }
        console.log("Fondo: "+user.fondo)
        if(user.fondo !== "user-info.jpg"){
            pathViejo = `./uploads/fondo/${ user.img }`;
            borrarImagen( pathViejo );
        }
        user.fondo = nameArchivo;
        await user.save();
        return true;
    break;
    }
}



module.exports = { 
    actualizarImagen
}
