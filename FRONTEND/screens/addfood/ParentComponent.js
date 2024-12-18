import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { getRecetteParId, getIngredientsParId,checkIfFavorite } from "../../services/apiService";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../styles/colors"; // Import des couleurs
import { addFavorite, removeFavorite, addToShoppingList } from "../../services/apiService";
import { useUser } from "../../services/Usercontext"; 

const ParentComponent = ({ route, navigation }) => {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [activeTab, setActiveTab] = useState("INGREDIENTS");
  const [ingredientsWithNames, setIngredientsWithNames] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const { userId } = useUser();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecetteParId(recipeId);
        setRecipe(data);
        const updatedIngredients = await Promise.all(
          data.ingredients.map(async (ingredient) => {
            const ingredientDetails = await getIngredientsParId(ingredient.ingredient._id);
            return { ...ingredient, name: ingredientDetails.nom };
          })
        );

        setIngredientsWithNames(updatedIngredients);

      if (userId) {
        const favoriteStatus = await checkIfFavorite(recipeId, userId);
        console.log(`yes/no ${favoriteStatus}`);
        setIsFavorite(favoriteStatus);
      }
    } catch (error) {
      console.error("Error fetching recipe or ingredients:", error);
    }
  };

    fetchRecipe();
  }, [recipeId]);
console.log(userId)
console.log (recipeId)
console.log(ingredientsWithNames)

const addToShoppingCart = async () => {
  try {
    for (const ingredient of ingredientsWithNames) {
      // Find the corresponding ingredient details in the recipe
      const name = ingredient.name
      const quantite = ingredient.quantite
      const unite = ingredient.unite
      console.log(name,quantite,unite)
        await addToShoppingList(
          userId,
          name,
          quantite, 
          unite,
        );
    }
    Alert.alert(
      "Succès",
      "Les ingrédients ont été ajoutés à votre liste de courses.",
      [{ text: "OK" }]
    );
    console.log("Ingrédients ajoutés à la liste de courses");
  } catch (error) {
    console.error("Erreur lors de l'ajout des ingrédients à la liste de courses:", error);
  }
};


  const toggleFavorite = async () => {
    if (!userId) {
      console.error("Utilisateur non connecté.");
      return;
    }

    try {
      if (isFavorite) {
        // Si la recette est déjà dans les favoris, la retirer
        await removeFavorite(recipeId, userId);
        setIsFavorite(false);
        console.log("Recette supprimée des favoris");
      } else {
        // Sinon, ajouter la recette aux favoris
        await addFavorite(recipeId, userId);
        setIsFavorite(true);
        console.log("Recette ajoutée aux favoris");
      }
    } catch (error) {
      console.error("Erreur lors de la gestion des favoris:", error);
    }
  };

  if (!recipe || ingredientsWithNames.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading recipe details...</Text>
      </View>
    );
  }
console.log(isFavorite)
  return (
    <LinearGradient
      colors={COLORS.gradients.background.colors}
      locations={COLORS.gradients.background.locations}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Fixed Header */}
        <View style={styles.header}>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign name="left" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity>
              <AntDesign name="ellipsis1" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView contentContainerStyle={styles.container}>
          {/* Recipe Image */}
          <Image source={{ uri: recipe.image }} style={styles.recipeImage} />

          {/* Recipe Description */}
          

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "INGREDIENTS" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("INGREDIENTS")}
            >
              <Text style={styles.tabText}>INGREDIENTS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "HOW TO COOK" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("HOW TO COOK")}
            >
              <Text style={styles.tabText}>HOW TO COOK</Text>
            </TouchableOpacity>
          </View>

          {/* Recipe Title Section */}
          <View style={styles.titleContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{recipe.nom}</Text>
              <View style={styles.iconContainer}>
              <TouchableOpacity onPress={toggleFavorite}>
                  <AntDesign
                    name={isFavorite ? "heart" : "hearto"}
                    size={24}
                    color={isFavorite ? "#E29578" : "black"} 
                    style={styles.icon}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={addToShoppingCart}>
                  <AntDesign name="shoppingcart" size={24} color="black" />
              </TouchableOpacity>

              
              </View>
            </View>
            <View style={styles.rowContainer}>
                <Text style={styles.time}>{recipe.tempsPreparation} min.</Text>
                <Text style={styles.time}>{recipe.calories} kcal</Text>
            </View>
          </View>
          <Text style={styles.descriptionText}>{recipe.description}</Text>
          {/* Ingredients List */}
          {activeTab === "INGREDIENTS" && (
            <View style={styles.ingredientsList}>
              {ingredientsWithNames.map((ingredient, index) => (
                <View style={styles.ingredientItem} key={index}>
                  <Text style={styles.ingredientName}>{ingredient.name}</Text>
                  <Text style={styles.ingredientAmount}>
                    {ingredient.quantite} {ingredient.unite}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* How to Cook Content */}
          {activeTab === "HOW TO COOK" && (
            <View style={styles.howToCookContent}>
              {recipe.instructions.map((step, index) => (
                <Text style={styles.stepText} key={index}>
                  {index + 1}. {step}
                </Text>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    paddingTop: 100,
    paddingBottom: 20,
  },
  header: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    zIndex: 1,
    padding: 8,
  },
  headerIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  recipeImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  descriptionText: {
    fontSize: 16,
    color: "#666",
    paddingHorizontal: 16,
    paddingTop: 10,
    lineHeight: 22,
    textAlign: "justify",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#2D958E",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
  titleContainer: {
    padding: 16,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
    gap: 16,
  },
  time: {
    color: "#2D958E",
    marginTop: 8,
    marginBottom:0
  },
  ingredientsList: {
    padding: 16,
    paddingTop:0,
    marginTop:0,
  },
  ingredientItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  ingredientName: {
    fontSize: 16,
  },
  ingredientAmount: {
    fontSize: 16,
  },
  howToCookContent: {
    padding: 16,
  },
  stepText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", 
    paddingHorizontal: 1,
    margin:0,
    margintop: 5
},

});

export default ParentComponent;
