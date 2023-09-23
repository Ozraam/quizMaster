const version = '1.2.0';
const versionDiv = document.createElement('div');
versionDiv.classList.add('version');
versionDiv.innerText = `Version: ${version}`;
document.body.appendChild(versionDiv);

// add styles to document
const style = document.createElement('style');
style.innerHTML = `
    .version {
        position: fixed;
        bottom: 0;
        right: 0;
        color: #000;
        padding: 0.5rem;
        font-size: 0.75rem;
    }
`;
document.head.appendChild(style);