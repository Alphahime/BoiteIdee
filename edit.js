export function editIdea(db, id, showMessage) {
    db.ref('idees/' + id).once('value')
    .then(snapshot => {
        const idee = snapshot.val();
        if (idee) {
            document.getElementById('ideeId').value = id;
            document.getElementById('titre').value = idee.titre;
            document.getElementById('categorie').value = idee.categorie;
            document.getElementById('description').value = idee.description;
        } else {
            showMessage('erreur', 'Idée non trouvée.');
        }
    })
    .catch(error => {
        console.error('Error fetching idea:', error);
        showMessage('erreur', 'Erreur lors de la récupération de l\'idée : ' + error.message);
    });
}
