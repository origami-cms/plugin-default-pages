import {Origami, Renderer, Route} from 'origami-core-lib';
import path from 'path';

const index: Origami.Server.RequestHandler = async (req, res, next) => {
    if (res.headersSent || res.body || res.data) return next();

    let file;
    let data;
    console.log(req.originalUrl);


    switch (req.originalUrl) {
        case '/':
            file = 'index.html';
            data = {title: 'Origami'};
            break;

        case '/forbidden':
        case '/403':
            file = 'forbidden.html';
            break;

        default:
        case '/404':
            file = 'not-found.html';
            data = {title: 'Page not found'};
    }


    const r = new Renderer();
    res.header('content-type', 'text/html');
    (await r.render(path.resolve(__dirname, '../templates', file), data))
        .pipe(res);

};

export interface Options {
    static?: string;
}

module.exports = (server: any, opts: Options = {}) => {
    server.useRouter(new Route('*')
        .position('pre-send')
        .get(index)
    );
    server.static(path.resolve(__dirname, '../static'), opts.static || '/origami/');
};
