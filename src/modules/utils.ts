export function fixDate(dateString: string, dateFormat: string) {
    let dateObj: Date = new Date(dateString);
    let dateTimezoneFixed: Date = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * -60000);
    if (dateFormat === 'shortDate') {
        return dateTimezoneFixed.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
        });
    } else {
        return dateTimezoneFixed.toLocaleDateString('en-US', {
            month: 'long',
            day: '2-digit',
            year: 'numeric',
        });
    }
}

export function createIcon(iconName: string) {
    const icon = document.createElement('span');
    icon.setAttribute('class', 'material-symbols-outlined');
    icon.textContent = iconName;
    return icon;
}

export function createLink(linkText: string, linkHref: string, external: boolean, iconText?: string) {
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

export function createyearSelect(years: number[]) {
    const yearSelect = years.reduce((acc: HTMLElement, year: number) => {
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

export function createHeader(heading: string, headerText: string) {
    const headerElem = document.createElement(heading);
    headerElem.textContent = headerText;
    return headerElem;
}