export function deleteIdea(index, idees, displayIdees) {
    idees.splice(index, 1);
    displayIdees();
}
