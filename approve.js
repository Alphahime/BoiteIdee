export function approveIdea(index, idees, displayIdees) {
    idees[index].approved = !idees[index].approved;
    displayIdees();
}
