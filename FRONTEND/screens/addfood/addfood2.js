import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  

} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Slider from "@react-native-community/slider";
import { Picker } from "@react-native-picker/picker";
import { addRecipe } from '../../services/apiService'; // Importer la méthode d'API
import Button from "../../components/Button"; 

const Addfood2 = ({ navigation }) => {
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    tempsPreparation: 30,
    image: "",
    category: "Breakfast", // Valeur par défaut
  });
  const [focusedInput, setFocusedInput] = useState(null);
  const [selectedTrimesters, setSelectedTrimesters] = useState([]);


  // Demander la permission d'accès à la galerie
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission d'accéder à la galerie nécessaire !");
      }
    })();
  }, []);
  const toggleTrimester = (trimester) => {
    setSelectedTrimesters((prev) =>
      prev.includes(trimester)
        ? prev.filter((item) => item !== trimester) 
        : [...prev, trimester] 
    );
  };
  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        maxFileSize: 12 * 1024 * 1024, // 12 MB limit
      });

      if (!result.canceled) {
        setFormData((prev) => ({
          ...prev,
          image: result.assets[0].uri,
        }));
      }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };

  // Convertir l'image en base64
  const convertImageToBase64 = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  };
  console.log("Selected Trimesters:", selectedTrimesters);
  // Soumettre la recette à l'API
  const handleSubmit = async () => {
    try {
      const imageBase64 = formData.image ? await convertImageToBase64(formData.image) : null;
      const recipeData = {
        nom: formData.nom,
        description: formData.description,
        tempsPreparation: formData.tempsPreparation,
        image: imageBase64, // Ajouter l'image en base64
        categorie: formData.category, // Ajouter la catégorie
        trimester: selectedTrimesters,
      };
      console.log("Recipe data:", recipeData);

      const response = await addRecipe(recipeData); // Appel à l'API
      console.log('Recipe added successfully:', response);
      navigation.navigate("addfood3", { recipeId: response._id });
    } catch (error) {
      console.error('Error submitting recipe:', error);
    }
  };

  return (
    
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.navigate("RecipesScreen")}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.pageNumber}>1/3</Text>
            </View>


      {/* Image Picker */}
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={pickImageFromGallery}
      >
        {formData.image ? (
          <Image
            source={{ uri: formData.image }}
            style={styles.selectedImage}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.uploadText}>Add Cover Photo</Text>
            <Text style={styles.uploadLimit}>(up to 12 Mb)</Text>
          </View>
        )}
      </TouchableOpacity>

            {/* Food Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Food Name</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedInput === "nom" && styles.inputFocused,
                ]}
                placeholder="Enter food name"
                value={formData.nom}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, nom: text }))
                }
                onFocus={() => setFocusedInput("nom")}
                onBlur={() => setFocusedInput(null)}
              />
            </View>



      {/* Category Picker */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category</Text>
        <Picker
          selectedValue={formData.category}
          onValueChange={(itemValue) =>
            setFormData((prev) => ({ ...prev, categorie: itemValue }))
          }
          style={styles.picker}
        >
          <Picker.Item label="Breakfast" value="Breakfast" />
          <Picker.Item label="Lunch" value="Lunch" />
          <Picker.Item label="Dinner" value="Dinner" />
          <Picker.Item label="Snacks" value="Snacks" />
        </Picker>
      </View>

            {/* Cooking Duration Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Cooking Duration (in minutes)</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedInput === "tempsPreparation" && styles.inputFocused,
                ]}
                placeholder="Enter cooking duration"
                keyboardType="numeric"
                value={formData.tempsPreparation}
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    tempsPreparation: text.replace(/[^0-9]/g, ""),
                  }))
                }
                onFocus={() => setFocusedInput("tempsPreparation")}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
            {/* Description Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  focusedInput === "description" && styles.inputFocused,
                ]}
                placeholder="Tell a little about your food"
                multiline
                numberOfLines={4}
                value={formData.description}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, description: text }))
                }
                onFocus={() => setFocusedInput("description")}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
{/* Trimester Checkboxes */}
<View style={styles.inputContainer}>
  <Text style={styles.label}>Choose Applicable Trimesters</Text>
  <View style={styles.checkboxGroup}>
    {[1, 2, 3].map((trimester) => (
      <TouchableOpacity
        key={trimester}
        style={[
          styles.checkboxContainer,
          selectedTrimesters.includes(trimester) && styles.checkboxSelected,
        ]}
        onPress={() => toggleTrimester(trimester)}
      >
        <Text
          style={[
            styles.checkboxLabel,
            selectedTrimesters.includes(trimester) && styles.checkboxLabelSelected,
          ]}
        >
          Trimester {trimester}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
</View>

      {/* Next Button */}
      <TouchableOpacity
        style={styles.nextButton}
        // Appel de la méthode handleSubmit
      >
       <Button
              title="Next"
              onPress={handleSubmit}
/>
      </TouchableOpacity>
    </View>
    </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
 
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cancelButton: {
    color: "#E29578",
    fontSize: 16,
  },
  pageNumber: {
    color: "#666",
    fontSize: 16,
  },
  imageContainer: {
    height: 200,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    alignItems: "center",
  },
  uploadText: {
    color: "#666",
    fontSize: 16,
    marginBottom: 5,
  },
  uploadLimit: {
    color: "#999",
    fontSize: 12,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: "#006D77",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputFocused: {
    borderColor: "#006D77",
    borderWidth: 2,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  checkboxGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  checkboxContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 100,
  },
  checkboxSelected: {
    backgroundColor: "#E29578",
    borderColor: "#E29578",
  },
  checkboxLabel: {
    color: "#666",
    fontSize: 14,
  },
  checkboxLabelSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  
});

export default Addfood2;