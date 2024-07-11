export function editIdea(index, idees, form, editIndex) {
    const idee = idees[index];
    document.getElementById('titre').value = idee.titre;
    document.getElementById('categorie').value = idee.categorie;
    document.getElementById('description').value = idee.description;
    editIndex.value = index;
}
