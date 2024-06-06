import { productModel } from "../models/productsModel.js";


export const getProductsServices = async ({
   limit = 50,
   page = 1,
   sort,
   query,
}) => {
   // OBJETIVOS : LIMIT PAGE SORT QUERY

   try {
      page = page == 0 ? 1 : page;
      page = Number(page);
      limit = Number(limit);
      const sortOrderOptions = { asc: -1, desc: 1 };
      sort = sortOrderOptions[sort] || null;
      page = Number(page);
      const skip = (page - 1) * limit;

      try {
         if (query) query = JSON.parse(decodeURIComponent(query));
      } catch (error) {
         console.log("error al parsear");
         query = {};
      }

      const queryProducts = productModel
         .find(query)
         .limit(limit)
         .skip(skip)
         .lean() // esto permite poder acceder a los datos de mongodb con handlebars, cumple con las normas de seguridad

      if (sort !== null) {
         queryProducts.sort({ price: sort });
      }

      const [productos, totalDocs] = await Promise.all([
         queryProducts,
         productModel.countDocuments(query),
      ]);

      // ESTRUCTURA DE PAGINACION

      const totalPages = Math.ceil(totalDocs / limit); // convertimos el limite a number
      const hasnextPage = page < totalPages; // si no cumple la condicion me da false por lo tanto no existe el nextPage
      const hasprevPage = page > 1; // si page es mayor a uno  puedo navegar hacia atras - es decir si es 1 no puedo
      const prevPage = hasprevPage ? page - 1 : false; // si existe hasPrevPage voy tener una a pagina, la cual luego le restamos 1 sino devolvemos null o false y queda en false por default
      const nextPage = hasnextPage ? page + 1 : false;
      const prevLink = prevPage
         ? `/productos?page=${prevPage}&limit=${limit}`
         : false; // son los links que permiten a los users meverse aentre las paginas
      const nextLink = nextPage
         ? `/productos?page=${nextPage}&limit=${limit}`
         : false;

      return {
         totalDocs, // indicador de el total de doucmentos
         limit, // indicador de el limite
         query: JSON.stringify(query),  // parseamos asi podemos enviar un objeto desde el query, se parsea el objeto a string
         page,
         totalPages, //   totalPages: totalPages - es igual a nuestra variable totalpages utilizamos nuestra variable que almacena la matematica del totalPages
         hasnextPage, // indicador si la pagina siguiente existe, devuelve un true o false
         hasprevPage, // indicador para saber si  existe una pagina previa, devuelve un true o false
         prevPage: prevPage, // esto es el numero de la pagina anterior
         nextPage: nextPage, // este es el numero de la pagina siguiente
         prevlink: prevLink, // link directo a la pagina previa
         nextlink: nextLink, // link directo a la pagina siguiente
         payload: productos, // obtenemos todos los productos
      };
   } catch (error) {
      console.log("no se pudo traer los productos");
      throw new Error("Error al traer los productos");
   }
};

export const getProductByIdServices = async ({pid}) => {
   try {
      return await productModel.findById(pid); // buscamos el id con la funcion findById y le pasamos como parametro el id del producto
   } catch (error) {
      console.log("no se pudo traer los producto por id");
      throw new Error("Error");
   }
};


export const getProductByCodeService = async (code) => {
   try {
      return await productModel.findOne({code}); // buscamos el id con la funcion findById y le pasamos como parametro el id del producto
   } catch (error) {
      console.log("GetProductByCodeService", error);
      throw new Error("Error");
   }
};


export const addProductServices = async ({title, description, price, code, stock, status, category,thumbnail}) => {
   try {
     return await productModel.create({title, description, price, code, stock, status, category,thumbnail });
   } catch (error) {
      console.log("no se pudo crear el producto");
   }
};

export const updateProductServices = async (pid,rest) => {
    try {
       return await productModel.findByIdAndUpdate(pid, { ...rest }, { new: true }); 
      
    } catch (error) {

       throw new Error("Error");
    }
 };

export const deleteProductServices = async (pid) => {
    // como vamos a llamar al modelo de nuestra base de datos como puede dar error lo hacemos en un try y un catch
    try {
      return await productModel.findByIdAndDelete(pid)
    } catch (error) {
       console.log("No se pudo eliminar el producto", error);
       throw new Error("Error");
    }  
}; 
