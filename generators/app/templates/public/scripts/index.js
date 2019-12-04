$(async function () {
    const viewer = await initViewer(document.getElementById('viewer'));
    const models = await getModels();
    const $models = $('#models');
    $models.on('change', function () {
        openModel(viewer, $models.val());
    });
    for (const [bucketKey, bucketModels] of Object.entries(models)) {
        const $group = $(`<optgroup label="${bucketKey}"></optgroup>`);
        for (const model of bucketModels) {
            $group.append(`<option value="${model.urn}">${model.name}</option>`);
        }
        $models.append($group);
    }
    openModel(viewer, $models.val()); // Open the currently selected model
});

// Load list of viewable models
async function getModels() {
    const resp = await fetch('/api/data/models');
    if (!resp.ok) {
        throw new Error(await resp.text());
    }
    const models = await resp.json();
    return models;
}

// Get access token for the viewer
async function getAccessToken() {
    const resp = await fetch('/api/auth/token');
    if (!resp.ok) {
        throw new Error(await resp.text());
    }
    const token = await resp.json();
    return token;
}

// Initialize the viewer
async function initViewer(container) {
    return new Promise(function (resolve, reject) {
        const options = {
            env: 'AutodeskProduction',
            getAccessToken: async function (callback) {
                const token = await getAccessToken();
                callback(token.access_token, token.expires_in);
            }
        };
        Autodesk.Viewing.Initializer(options, () => {
            const viewer = new Autodesk.Viewing.GuiViewer3D(container);
            viewer.start();
            resolve(viewer);
        });
    });
}

// Open viewable model
function openModel(viewer, urn) {
    function onDocumentLoadSuccess(doc) {
        viewer.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry());
    }
    function onDocumentLoadFailure(code) {
        console.error(`Could not load document (code: ${code}).`);
    }
    if (urn) {
        Autodesk.Viewing.Document.load('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure);
    }
}
