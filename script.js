import { deleteIdea } from './delete.js';
import { editIdea } from './edit.js';
import { approveIdea } from './approve.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formeIdee');
    const messages = document.getElementById('messages');
    const listeIdee = document.getElementById('listeIdee');
    let idees = [];
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
            form.style.display = 'block'; 
        } else {
            showMessage('erreur', 'Le libellé doit être entre 3 et 15 caractères.');
            form.style.display = 'none'; 
        }
    });

    function validateForm(titre, categorie, description) {
        if (titre.length < 3 || titre.length > 15) {
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
            if (type === 'erreur') {
                form.style.display = 'block'; 
            }
        }, 2000);
        
     
        setTimeout(() => {
            form.style.display = 'block';
        }, 2000);
    }

    function addIdee(titre, categorie, description) {
        const idee = { titre, categorie, description, approved: false };
        idees.push(idee);
        displayIdees();
    }

    function updateIdee(titre, categorie, description) {
        idees[editIndex.value] = { titre, categorie, description, approved: idees[editIndex.value].approved };
        editIndex.value = null;
        displayIdees();
    }

    function displayIdees() {
        listeIdee.innerHTML = '';
        idees.forEach((idee, index) => {
            const ideeElement = document.createElement('div');
            ideeElement.classList.add('idee');
            ideeElement.innerHTML = `
                <h3>${idee.titre}</h3>
                <p>Catégorie: ${idee.categorie}</p>
                <p>${idee.description}</p>
                <button class="approve" data-index="${index}">${idee.approved ? 'Désapprouver' : 'Approuver'}</button>
                <button class="edit" data-index="${index}">Modifier</button>
                <button class="delete" data-index="${index}">Supprimer</button>
            `;
            listeIdee.appendChild(ideeElement);
        });

        document.querySelectorAll('.approve').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                approveIdea(index, idees, displayIdees);
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
            });
        });
    }
});
