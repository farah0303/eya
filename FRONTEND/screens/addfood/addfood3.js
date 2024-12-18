

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { addIngredient, updateRecipeWithIngredients } from "../../services/apiService"; // Import des services

const Addfood3 = ({ navigation, route }) => {
  const [ingredients, setIngredients] = useState([{ nom: "", quantite: "", unite: "" , calorie: ""},]);
  const [loading, setLoading] = useState(false);

  const addIngredientInput = () => {
    setIngredients([...ingredients,{ nom: "", quantite: "", unite: "" , calorie: ""}]);
  };

  const updateIngredientInput = (field, text, index) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = text;
    setIngredients(newIngredients);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
  
      // Ajouter chaque ingrédient au backend avec la quantité
      const ingredientIds = [];
      for (const ingredient of ingredients) {
     
        if (ingredient.nom.trim() && ingredient.quantite.trim() && ingredient.unite.trim() && ingredient.calorie.trim()) {
          const addedIngredient = await addIngredient({
            nom: ingredient.nom,
          });
          ingredientIds.push({
            ingredient: addedIngredient._id,
            quantite: ingredient.quantite,
            unite : ingredient.unite,
            calorie: ingredient.calorie,
          });
        }
      }
  
      // Mettre à jour la recette avec les IDs des ingrédients
      const recipeId = route.params.recipeId; // ID de la recette passée via navigation
      console.log("Recipe ID:", recipeId);

      
      await updateRecipeWithIngredients(recipeId, { ingredients: ingredientIds });
  
      navigation.navigate("addfood4", { recipeId });
    } catch (error) {
      Alert.alert("Erreur", error.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };
  
  console.log("ingredients:", ingredients);



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Ingredients</Text>
        <Text style={styles.pageIndicator}>2/3</Text>
      </View>

      <View style={styles.ingredientsList}>
        {ingredients.map((ingredient, index) => (
          <View key={index} style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter ingredient"
              value={ingredient.nom}
              onChangeText={(text) => updateIngredientInput("nom", text, index)}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              placeholder="Enter quantity"
              value={ingredient.quantite}
              onChangeText={(text) => updateIngredientInput("quantite", text, index)}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              placeholder="Enter unit (e.g., kg, ml, ....)"
              value={ingredient.unite}
              onChangeText={(text) => updateIngredientInput("unite", text, index)}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              placeholder="Enter nb of calories in kcal "
              value={ingredient.calorie}
              onChangeText={(text) => updateIngredientInput("calorie", text, index)}
              placeholderTextColor="#999"
            />
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={addIngredientInput}>
          <Text style={styles.addButtonText}>+ Ingredient</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("addfood2")}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.nextButtonText}>
            {loading ? "Loading..." : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#006D77",
  },
  pageIndicator: {
    fontSize: 16,
    color: "#666",
  },
  ingredientsList: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderRadius: 25,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  addButtonText: {
    color: "#2D958E",
    fontSize: 18,
    fontWeight: "500",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  backButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    backgroundColor: "#f5f5f5",
    width: "45%",
    alignItems: "center",
  },
  nextButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    backgroundColor: "#2D958E",
    width: "45%",
    alignItems: "center",
  },
  backButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default Addfood3;


