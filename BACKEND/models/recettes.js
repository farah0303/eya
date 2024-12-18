
const mongoose = require('mongoose');

const trimesterCategories = [1, 2, 3];
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
    trimester: {

        type: [Number], // Array of strings

        required: true,

        validate: [

            {

                validator: function (categories) {

                    // Ensure all categories are valid

                    return categories.every(cat => 
trimesterCategories.includes(cat));

                },

                message: props => `${props.value} contains an invalid category. Allowed categories are: ${trimesterCategories.join(', ')}.`

            }

        ]

    },

}, { timestamps: true });

module.exports = mongoose.model('Recette', recettesSchema);
