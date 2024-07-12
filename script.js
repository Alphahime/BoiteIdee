import { deleteIdea } from './delete.js';
import { editIdea } from './edit.js';
import { approveIdea } from './approve.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formeIdee');
    const messages = document.getElementById('messages');
    const listeIdee = document.getElementById('listeIdee');
    let idees = JSON.parse(localStorage.getItem('idees')) || [];
    let editIndex = { value: null };

    form.addEventListener('submit', function(event){
        event.preventDefault();
        const titre = document.getElementById('titre').value.trim();
        const categorie = document.getElementById('categorie').value;
        const description = document.getElementById('description').value.trim();
         
        if (validateForm(titre, categorie, description)) {
            if (editIndex.value === null) {
                addIdee(titre, categorie, description);
                showMessage('success', 'Votre idée a été soumise avec succès !');
            } else {
                updateIdee(titre, categorie, description);
                showMessage('success', 'Votre idée a été mise à jour avec succès !');
            }
            form.reset();
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
        const idee = { titre, categorie, description, approved: false };
        idees.push(idee);
        saveToLocalStorage();
        displayIdees();
    }

    function updateIdee(titre, categorie, description) {
        idees[editIndex.value] = { titre, categorie, description, approved: idees[editIndex.value].approved };
        editIndex.value = null;
        saveToLocalStorage();
        displayIdees();
    }

    function saveToLocalStorage() {
        localStorage.setItem('idees', JSON.stringify(idees));
    }

    function displayIdees() {
        listeIdee.innerHTML = '';
        idees.forEach((idee, index) => {
            const ideeElement = document.createElement('div');
            ideeElement.classList.add('idea');
            if (!idee.approved) {
                ideeElement.classList.add('disapproved'); 
            }
            ideeElement.innerHTML = `
                <h3>${idee.titre}</h3>
                <p>Catégorie: ${idee.categorie}</p>
                <p>${idee.description}</p>
                <button class="approve" data-index="${index}">${idee.approved ? 'Désapprouver' : 'Approuver'}</button>
                <button class="edit" data-index="${index}"><i class="fas fa-edit"></i></button>
                <button class="delete" data-index="${index}"><i class="fas fa-trash-alt"></i></button>
            `;
            listeIdee.appendChild(ideeElement);
        });

        document.querySelectorAll('.approve').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                approveIdea(index, idees, displayIdees);
                saveToLocalStorage(); 
            });
        });

        document.querySelectorAll('.edit').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                editIdea(index, idees, form, editIndex);
            });
        });

        document.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                deleteIdea(index, idees, displayIdees);
                saveToLocalStorage();
            });
        });
    }

    displayIdees();
});
