import { approveIdea } from './approve.js';
import { editIdea } from './edit.js';
import { deleteIdea } from './delete.js';

// Firebase configuration for Realtime Database
const firebaseConfig = {
    apiKey: "AIzaSyDBQEMs0rEyWZbBsjsbDgE2UyM3SNsbjM8",
    authDomain: "boite-360d0.firebaseapp.com",
    projectId: "boite-360d0",
    databaseURL: "https://boiteidee-b74cc-default-rtdb.firebaseio.com",
    storageBucket: "boite-360d0.appspot.com",
    messagingSenderId: "618849748862",
    appId: "1:618849748862:web:bf5419a1ab74bb98ae952f",
    measurementId: "G-S85GBMHT7F"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formeIdee');
    const messages = document.getElementById('messages');
    const listeIdee = document.getElementById('listeIdee');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const ideeId = document.getElementById('ideeId').value;
        const titre = document.getElementById('titre').value.trim();
        const categorie = document.getElementById('categorie').value;
        const description = document.getElementById('description').value.trim();

        console.log('Form submitted:', ideeId, titre, categorie, description);

        if (validateForm(titre, categorie, description)) {
            if (ideeId) {
                updateIdee(ideeId, titre, categorie, description);
            } else {
                addIdee(titre, categorie, description);
            }
            form.reset();
            document.getElementById('ideeId').value = ''; // Clear the hidden field
        }
    });

    function validateForm(titre, categorie, description) {
        if (titre.length < 3 || titre.length > 15) {
            showMessage('erreur', 'Le libellé doit être entre 3 et 15 caractères.');
            return false;
        }
        if (description.length > 255) {
            showMessage('erreur', 'Le message ne peut pas dépasser 255 caractères.');
            return false;
        }
        return titre !== '' && categorie !== '' && description !== '';
    }

    function showMessage(type, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add(type);
        messageElement.textContent = message;
        messages.appendChild(messageElement);

        setTimeout(() => {
            messages.removeChild(messageElement);
        }, 2000);
    }

    function addIdee(titre, categorie, description) {
        console.log('Adding idea:', titre, categorie, description);
        const newIdeeRef = db.ref('idees').push();
        
        newIdeeRef.set({
            titre,
            categorie,
            description,
            approved: false
        })
        .then(() => {
            showMessage('success', 'Votre idée a été soumise avec succès !');
            displayIdees();
        })
        .catch(error => {
            console.error('Error adding idea:', error);
            showMessage('erreur', 'Erreur lors de la soumission de l\'idée : ' + error.message);
        });
    }

    function updateIdee(id, titre, categorie, description) {
        console.log('Updating idea:', id, titre, categorie, description);
        db.ref('idees/' + id).update({
            titre: titre,
            categorie: categorie,
            description: description
        })
        .then(() => {
            showMessage('success', 'Idée mise à jour avec succès !');
            displayIdees();
        })
        .catch(error => {
            console.error('Error updating idea:', error);
            showMessage('erreur', 'Erreur lors de la mise à jour de l\'idée : ' + error.message);
        });
    }

    function displayIdees() {
        console.log('Fetching ideas from Realtime Database...');
        db.ref('idees').once('value')
        .then(snapshot => {
            listeIdee.innerHTML = '';
            snapshot.forEach(childSnapshot => {
                const idee = childSnapshot.val();
                const ideeElement = document.createElement('div');
                ideeElement.classList.add('idea');
                if (!idee.approved) {
                    ideeElement.classList.add('disapproved'); 
                }
                ideeElement.innerHTML = `
                    <h3>${idee.titre}</h3>
                    <p>Catégorie: ${idee.categorie}</p>
                    <p>${idee.description}</p>
                    <button class="approve" data-id="${childSnapshot.key}">${idee.approved ? 'Désapprouver' : 'Approuver'}</button>
                    <button class="edit" data-id="${childSnapshot.key}"><i class="fas fa-edit"></i>Modifier</button>
                    <button class="delete" data-id="${childSnapshot.key}"><i class="fas fa-trash-alt"></i>Supprimer</button>
                `;
                listeIdee.appendChild(ideeElement);
            });

            addEventListeners();
        })
        .catch(error => {
            console.error('Error fetching ideas:', error);
            showMessage('erreur', 'Erreur lors de la récupération des idées : ' + error.message);
        });
    }

    function addEventListeners() {
        document.querySelectorAll('.approve').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                approveIdea(db, id, showMessage, displayIdees);
            });
        });

        document.querySelectorAll('.edit').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                editIdea(db, id, showMessage);
            });
        });

        document.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                deleteIdea(db, id, showMessage, displayIdees);
            });
        });
    }

    displayIdees();
});
