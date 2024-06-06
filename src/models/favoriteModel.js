import { Schema, model } from "mongoose";

const nameCollection = "favorites";

const favoriteSchema = new Schema({
   favorites: [
      {
         id: {
            type: Schema.Types.ObjectId,
            ref: "Producto",
         },
      },
      {
         productTitle: { type: String },
      },
      {
         productPrice: { type: String },
      },
   ],
});



export const favoriteModel = model(nameCollection, favoriteSchema)