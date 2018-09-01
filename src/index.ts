import {Origami, Renderer, Route} from 'origami-core-lib';
import Server from 'origami-core-server';
import path from 'path';

const index: Origami.Server.RequestHandler = async (req, res, next) => {
    if (res.headersSent || res.body || res.data) return next();

    let file;
    let data;

    switch (req.originalUrl) {
        case '/':
            file = 'index.html';
            data = {title: 'Origami'};
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

module.exports = (server: Server, opts: Options = {}) => {
    server.useRouter(new Route('*')
        .position('pre-send')
        .get(index)
    );
    server.static(path.resolve(__dirname, '../static'), opts.static || '/origami/');
};
