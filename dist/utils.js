export function fixDate(dateString, dateFormat) {
    let dateObj = new Date(dateString);
    let dateTimezoneFixed = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * -60000);
    if (dateFormat === 'shortDate') {
        return dateTimezoneFixed.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
        });
    }
    else {
        return dateTimezoneFixed.toLocaleDateString('en-US', {
            month: 'long',
            day: '2-digit',
            year: 'numeric',
        });
    }
}
export function createIcon(iconName) {
    const icon = document.createElement('span');
    icon.setAttribute('class', 'material-symbols-outlined');
    icon.textContent = iconName;
    return icon;
}
export function createLink(linkText, linkHref, external, iconText) {
    const newLink = document.createElement('a');
    if (iconText) {
        const icon = createIcon(iconText);
        newLink.appendChild(icon);
    }
    newLink.setAttribute('href', linkHref);
    if (external) {
        newLink.setAttribute('target', '_blank');
    }
    newLink.textContent = linkText;
    return newLink;
}
export function createyearSelect(years) {
    const yearSelect = years.reduce((acc, year) => {
        const option = document.createElement('option');
        option.textContent = year.toString();
        option.setAttribute('value', year.toString());
        acc.appendChild(option);
        return acc;
    }, document.createElement('select'));
    const chooseOption = document.createElement('option');
    chooseOption.textContent = "All Years";
    chooseOption.setAttribute('value', "0");
    chooseOption.selected = true;
    yearSelect.prepend(chooseOption);
    return yearSelect;
}
