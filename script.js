document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formeIdee');
    const messages = document.getElementById('messages');
    const listeIdee = document.getElementById('listeIdee');
    let idees = [];
    let editIndex = null;

    form.addEventListener('submit', function(event){
        event.preventDefault();
        const titre = document.getElementById('titre').value.trim();
        const categorie = document.getElementById('categorie').value;
        const description = document.getElementById('description').value.trim();
         
        if (validateForm(titre, categorie, description)) {
            if (editIndex === null) {
                addIdee(titre, categorie, description);
                showMessage('success', 'Votre idée a été soumise avec succès !');
            } else {
                updateIdee(titre, categorie, description);
                showMessage('success', 'Votre idée a été mise à jour avec succès !');
            }
            form.reset();
        } else {
            showMessage('error', 'Veuillez remplir tous les champs correctement.');
        }
    });

    function validateForm(titre, categorie, description) {
        return titre !== '' && categorie !== '' && description !== '';
    }

    function showMessage(type, message) {
        const messageElement = document.createElement('div');
        messageElement.id = type;
        messageElement.textContent = message;
        messages.appendChild(messageElement);

        setTimeout(() => {
            messages.removeChild(messageElement);
        }, 2000);
    }

    function addIdee(titre, categorie, description) {
        const idee = { titre, categorie, description, approved: false };
        idees.push(idee);
        displayIdees();
    }

    function updateIdee(titre, categorie, description) {
        idees[editIndex] = { titre, categorie, description, approved: idees[editIndex].approved };
        editIndex = null;
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
                <button onclick="approveIdea(${index})">${idee.approved ? 'Désapprouver' : 'Approuver'}</button>
                <button onclick="editIdea(${index})">Modifier</button>
                <button onclick="deleteIdea(${index})">Supprimer</button>
            `;
            listeIdee.appendChild(ideeElement);
        });
    }

    window.approveIdea = function(index) {
        idees[index].approved = !idees[index].approved;
        displayIdees();
    }

    window.editIdea = function(index) {
        const idee = idees[index];
        document.getElementById('titre').value = idee.titre;
        document.getElementById('categorie').value = idee.categorie;
        document.getElementById('description').value = idee.description;
        editIndex = index;
    }

    window.deleteIdea = function(index) {
        idees.splice(index, 1);
        displayIdees();
    }
});
