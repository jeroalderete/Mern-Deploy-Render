



export const validFileExtension = (originalname = '') =>{

    const validFormat = ['png','jpg','jpeg'];

    // lo separo por un punto al originalname que recibimos para validarlo

    const validExtension = originalname.split('.');

    // accedo al ultimo valor del array
    const extension = validExtension[validExtension.length - 1]

    // si nuestro array incluye alguna extension permitida es true

    if(validFormat.includes(extension.toLowerCase())){
        return true;
    }

    return false;
}



// nosotros recibimos la propiedad originalname