export function deleteIdea(db, id, showMessage, displayIdees) {
    const ideeRef = db.ref('idees').child(id);
    ideeRef.remove()
    .then(() => {
        showMessage('success', 'L\'idée a été supprimée avec succès !');
        displayIdees();
    })
    .catch(error => {
        console.error('Error deleting idea:', error);
        showMessage('erreur', 'Erreur lors de la suppression de l\'idée : ' + error.message);
    });
}
