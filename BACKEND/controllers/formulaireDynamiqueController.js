// Simuler la sauvegarde d'un formulaire dynamique
// exports.sauvegarderFormulaire = async (req, res) => {
//     try {
//         const formulaireData = req.body; // Données dynamiques reçues
//         // Vous pouvez traiter ou valider les données ici si nécessaire
//         res.status(201).json({ message: 'Formulaire sauvegardé avec succès', formulaire: formulaireData });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// controllers/formulaireDynamiqueController.js
const FormulaireDynamique = require('../models/formulaireDynamique');

// Créer un formulaire dynamique
exports.createFormulaire = async (req, res) => {
  try {
    const formulaire = new FormulaireDynamique(req.body);
    await formulaire.save();
    res.status(201).send(formulaire);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Obtenir tous les formulaires dynamiques
exports.getFormulaires = async (req, res) => {
  try {
    const formulaires = await FormulaireDynamique.find();
    res.status(200).send(formulaires);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Obtenir un formulaire dynamique par ID
exports.getFormulaireById = async (req, res) => {
  try {
    const formulaire = await FormulaireDynamique.findById(req.params.id);
    if (!formulaire) {
      return res.status(404).send({ message: 'Formulaire non trouvé' });
    }
    res.status(200).send(formulaire);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Mettre à jour un formulaire dynamique
exports.updateFormulaire = async (req, res) => {
  try {
    const formulaire = await FormulaireDynamique.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!formulaire) {
      return res.status(404).send({ message: 'Formulaire non trouvé' });
    }
    res.status(200).send(formulaire);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Supprimer un formulaire dynamique
exports.deleteFormulaire = async (req, res) => {
  try {
    const formulaire = await FormulaireDynamique.findByIdAndDelete(req.params.id);
    if (!formulaire) {
      return res.status(404).send({ message: 'Formulaire non trouvé' });
    }
    res.status(200).send({ message: 'Formulaire supprimé avec succès' });
  } catch (error) {
    res.status(500).send(error);
  }
};
