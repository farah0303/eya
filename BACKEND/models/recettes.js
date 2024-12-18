
const mongoose = require('mongoose');


const recettesSchema = new mongoose.Schema({
    categorie: { type: String , required: false },
    image: { type: String, required: false },
    nom: { type: String, required: true },
    description: { type: String },
    tempsPreparation: { type: Number, required: true },
    calories: { type: Number },
    ingredients: [
        {
            ingredient: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' },
            quantite: { type: Number, required: false },
            unite: { type: String, required: false },
            calorie: { type: Number, required: false },
        },
    ],
    instructions: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Recette', recettesSchema);
