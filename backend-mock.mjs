import jsonServer from 'json-server'

const backendUrl = new URL(process.env.DEV_PROXY_TARGET || 'http://0.0.0.0:5000');
const filesDir = process.env.FILES_DIR || '/files';
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.get('/api/bands/:bandId/titles', (req, res) => {
    const sheets = router.db.get('sheets').filter({ bandId: req.params.bandId }).value();

    const titles = [
        ...new Map(sheets.map(sheet => [sheet.title, {
            title: sheet.title,
            group_key: sheet.group_key
        }])).values()
    ];
    res.json({ titles });
});

server.get('/files/:bandId/:fileId', (req, res) => {
    const { bandId, fileId } = req.params;
    res.sendFile(`${bandId}/${fileId}`, { root: filesDir });
});

server.use('/api', router);

server.listen(Number(backendUrl.port), backendUrl.hostname, () => {
    console.log(`JSON Server is running on ${backendUrl.origin}`);
});
