const express = require('express');
const { DataManagementClient, urnify } = require('forge-server-utils');
const config = require('../../config');

let dataManagementClient = new DataManagementClient({ client_id: config.forge.client_id, client_secret: config.forge.client_secret });
let router = express.Router();

// GET /api/data/models
// List viewable models
router.get('/models', async function (req, res) {
    try {
        const objects = await dataManagementClient.listObjects(config.forge.bucket);
        res.json(objects.map(obj => {
            return {
                name: obj.objectKey,
                urn: urnify(obj.objectId)
            };
        }));
    } catch (err) {
        console.error(err);
        res.status(400).send(err);
    }
});

module.exports = router;
