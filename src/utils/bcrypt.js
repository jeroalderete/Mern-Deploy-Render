// recibimos pass dcomo parametro

import bcryptjs from 'bcryptjs';

// recibimos pass como parametro
export const createHash = (password) => {
    // creamos los saltos es decir las vueltas que haga ese hasheo
    // se considera que despues de 10 saltos es relativamente seguro
    // importante mientras mas saltos mas se demora
    const salt = bcryptjs.genSaltSync(10);
    // creamos el hasheo de la clave, le pasamos la password que queremos hashear y el salto
    const passHash = bcryptjs.hashSync(password, salt);

    // para visualizar
    console.log({ passHash });

    return passHash;
};

// esta funcion recibe 2 parametros la password que se ingresa por el fornt en el html y el userPassword que es la clave hasheada en mongodb
export const isValidPassword = (password, mongoUserPassword) =>{
    const isPassValid = bcryptjs.compareSync(password,mongoUserPassword)

    return isPassValid;
}



/* 

Recomendaciones Generales

    10 saltos: Es una configuración comúnmente utilizada que ofrece un buen equilibrio entre seguridad y rendimiento.
    12 saltos: Proporciona mayor seguridad a costa de un tiempo de procesamiento ligeramente mayor. Es una buena opción si puedes permitir un poco más de carga en tu servidor.
    14 saltos o más: Ofrece una seguridad aún mayor, pero puede ser demasiado lento para aplicaciones con un alto volumen de solicitudes de autenticación. Úsalo si la seguridad es extremadamente crítica y puedes permitir tiempos de procesamiento más largos.

Consideraciones Adicionales

    Potencia del Hardware: Cuanto más potente sea el hardware, más saltos puedes permitir sin afectar negativamente el rendimiento.
    Volumen de Usuarios: Si tu aplicación tiene muchos usuarios, un número muy alto de saltos puede afectar la escalabilidad.
    Requerimientos de Seguridad: Evalúa las necesidades específicas de seguridad de tu aplicación. Si manejas datos extremadamente sensibles, puedes optar por más rondas.

*/ 