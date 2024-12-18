

import axios from 'axios';

const API_URL = 'http://192.168.1.108:5000/api'; // Replace with your actual backend URL

export const signUpUser = async (userData) => {
    const user = {
        email: userData.email,
        motDePasse: userData.motDePasse,
    };

    try {
        console.log('Sign-up Data:', user);
        const response = await axios.post(`${API_URL}/auth/inscrire`, user);
       
        return response.data;
    } catch (error) {
        console.error('Sign-up Error:', error);
        throw error.response?.data || error.message;
    }
};

export const getRecipes = async () => {
    try {
        const response = await axios.get(`${API_URL}/recettes`);
        console.log('Recipes:', response.data); // Logs the recipes
        return response.data; // Return the recipe data
    } catch (error) {
        console.error('Error fetching recipes:', error);}}

export const loginUser = async (userData) => {
    const user = {
        email: userData.email,
        motDePasse: userData.motDePasse,
    };

    try {
        console.log('Login Data:', user);
        const response = await axios.post(`${API_URL}/auth/connexion`, user);
        console.log('Response:', response.data);
        return response.data; // Contient l'utilisateur connecté
    } catch (error) {
        console.error('Login Error:', error);

        throw error.response?.data || error.message;
    }
};

export const addRecipe = async (recipeData) => {
    try {
      const response = await axios.post(`${API_URL}/recettes`, recipeData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data; // Retourne la réponse de l'API (par exemple, la recette ajoutée)
    } catch (error) {
      console.error('Error adding recipe:', error);
      throw error;
    }
  };

  // Récupérer les ingrédients
export const getIngredients = async () => {
    try {
        const response = await axios.get(`${API_URL}/ingredients`);
        console.log('Ingredients:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching ingredients:', error);}}


export const getIngredientsParId = async (IngredientId) => {
  try {
    console.log(`Fetching ingredient with ID: ${IngredientId}`); 
    const response = await axios.get(`${API_URL}/ingredients/${IngredientId}`);
    console.log("Ingredient data:", response.data);
    return response.data; 
  } catch (error) {
    console.error("Error fetching ingredient:", error);
    throw error; 
  }
};

// Créer un formulaire dynamique
export const createFormulaire = async (formData) => {
    try {
        console.log('Creating Form:', formData);
        const response = await axios.post(`${API_URL}/formulaireDynamique`, formData);
        console.log('Formulaire Created:', response.data);
        return response.data;
    } catch (error) {
        console.error('Create Form Error:', error);

        throw error.response?.data || error.message;
    }
};

// Ajouter un nouvel ingrédient
export const addIngredient = async (ingredientData) => {
    try {
        const response = await axios.post(`${API_URL}/ingredients`, ingredientData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // Retourne l'ingrédient ajouté
    } catch (error) {
        console.error('Error adding ingredient:', error);}}
// Obtenir tous les formulaires dynamiques
export const getFormulaires = async () => {
    try {
        const response = await axios.get(`${API_URL}/formulaireDynamique`);
        console.log('Formulaires:', response.data);
        return response.data;
    } catch (error) {
        console.error('Get Formulaires Error:', error);
        throw error.response?.data || error.message;
    }
};

// Mettre à jour une recette avec des ingrédients
export const updateRecipeWithIngredients = async (recipeId, { ingredients }) => {
  try {
      // Calculer la somme des calories de tous les ingrédients
      const totalCalories = ingredients.reduce((sum, ingredient) => {
          return sum + (ingredient.calorie || 0); // Si `calorie` est null ou undefined, utiliser 0
      }, 0);
      console.log(totalCalories)
      // Inclure la somme des calories dans la requête
      const response = await axios.put(
          `${API_URL}/recettes/${recipeId}`,
          { 
              ingredients, 
              calories: totalCalories // Ajout du champ calories
          },
          {
              headers: {
                  'Content-Type': 'application/json',
              },
          }
      );
      console.log(response);
      console.log(response.data);

      return response.data; // Retourne la recette mise à jour
  } catch (error) {
      console.error('Error updating recipe:', error);
  }
};
// Mettre à jour un formulaire dynamique
export const updateFormulaire = async (id, formData) => {
    try {
        const response = await axios.put(`${API_URL}/formulaireDynamique/${id}`, formData);
        console.log('Formulaire Updated:', response.data);
        return response.data;
    } catch (error) {
        console.error('Update Form Error:', error);
        throw error.response?.data || error.message;
    }
};

export const updateRecipeWithInstructions = async (recipeId, {instructions}) => {
    try {
        const response = await axios.put(`${API_URL}/recettes/${recipeId}`, { instructions }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // Retourne la recette mise à jour
    } catch (error) {
        console.error('Error updating instructions:', error);
        throw error.response?.data || error.message;
    }
};
// Supprimer un formulaire dynamique
export const deleteFormulaire = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/formulaireDynamique/${id}`);
        console.log('Formulaire Deleted:', response.data);
        return response.data;
    } catch (error) {
        console.error('Delete Form Error:', error);
        throw error.response?.data || error.message;
    }
};


export const getRecetteParId = async (recipeId) => {
  try {
    const response = await axios.get(`${API_URL}/recettes/${recipeId}`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching recipe:", error);
    throw error; 
  }
};

export const updateFavoriteStatus = async (recipeId, favoriteStatus) => {
    try {
      const response = await axios.put(
        `${API_URL}/recettes/${recipeId}/favorite`,
        { favorite: favoriteStatus } 
      );
      console.log(response)
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Error updating favorite status:', error);
      throw error; 
    }
  };

  export const addFavorite = async (recetteId, utilisateurId) => {
    try {
      // Vérifier si l'ID utilisateur est présent
      if (!utilisateurId) {
        throw new Error("L'ID utilisateur est requis pour ajouter aux favoris.");
      }
      const response = await axios.post(
        `${API_URL}/auth/favorites`, // URL pour ajouter la recette aux favoris
        { recetteId, utilisateurId } // Envoyer les deux informations nécessaires
      );
  
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        // Si l'erreur provient du serveur
        console.error('Erreur lors de l\'ajout aux favoris:', error.response.data);
        throw new Error(error.response.data.message || 'Erreur interne du serveur');
      } else if (error.request) {
        // Si la requête a été envoyée, mais qu'aucune réponse n'a été reçue
        console.error('Pas de réponse du serveur:', error.request);
        throw new Error('Aucune réponse du serveur');
      } else {
        // Autres erreurs
        console.error('Erreur lors de l\'ajout aux favoris:', error.message);
        throw error;
      }
    }
  };

  export const checkIfFavorite = async (recipeId, userId) => {
    try {
      const response = await fetch(`${API_URL}/auth/favorites/${userId}/${recipeId}`);
      const data = await response.json();
      return data.isFavorite; // Retourne true ou false
    } catch (error) {
      console.error("Erreur lors de la vérification de l'état favori :", error);
      return false;
    }
  };

  export const removeFavorite = async (recipeId, userId) => {
    try {
      const response = await fetch(`${API_URL}/auth/favorites`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recetteId: recipeId,
          utilisateurId: userId,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        return data.message;
      } else {
        throw new Error(data.message || 'Erreur lors de la suppression des favoris');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression des favoris:', error);
      throw error;
    }
  };

  export const getFavoriteRecipes = async (userId) => {
    try {
      // Ensure userId is provided
      if (!userId) {
        throw new Error('User ID is required');
      }
  
      // Make the API call to fetch the favorite recipes
      const response = await fetch(`${API_URL}/auth/favorites/${userId}`);
  
      // If the response is not OK, throw an error
      if (!response.ok) {
        throw new Error('Failed to fetch favorite recipes');
      }
  
      // Parse and return the JSON data (the recipes)
      console.log(response)
      const recipes = await response.json();
      return recipes;
    } catch (error) {
      console.error('Error fetching favorite recipes:', error);
      throw error; // Rethrow the error so it can be handled by the caller
    }
  };

  export const addToShoppingList = async (userId, name, quantite, unite) => {
    try {
        // Map the incoming parameters to the required API payload fields
        const response = await axios.post(`${API_URL}/auth/shopping-list/add`, {
            userId,
            ingredientName: name, // Map 'name' to 'ingredientName'
            quantity: quantite,   // Map 'quantite' to 'quantity'
            unit: unite,          // Map 'unite' to 'unit'
        });

        console.log("UserId:", userId);
        console.log("IngredientName:", name);
        console.log("Quantity:", quantite);
        console.log("Unit:", unite);

        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'ajout à la liste de courses:", error);
        throw error;
    }
};