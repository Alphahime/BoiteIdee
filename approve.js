export function approveIdea(db, id, showMessage, displayIdees) {
    const ideeRef = db.ref('idees').child(id);
    ideeRef.once('value')
    .then(snapshot => {
        const idee = snapshot.val();
        idee.approved = !idee.approved;
        return ideeRef.update({ approved: idee.approved });
    })
    .then(() => {
        showMessage('success', 'L\'idée a été approuvée/désapprouvée avec succès !');
        displayIdees();
    })
    .catch(error => {
        console.error('Error approving idea:', error);
        showMessage('erreur', 'Erreur lors de l\'approbation/désapprobation de l\'idée : ' + error.message);
    });
}
