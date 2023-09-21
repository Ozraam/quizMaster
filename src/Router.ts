import { readdir } from "fs/promises"

export class Router {
    
    routes: Map<string, (req: Request) => Promise<Response>>
    constructor() {
        console.log('Router')
        this.routes = new Map()
    }

    addRoute(route: string, handler: (req: Request) => Promise<Response>) {
        this.routes.set(route, handler)
    }

    fetch(req: Request) : Promise<Response> {
        const url = new URL(req.url)
        const date = `[${new Date().toLocaleString()}]`
        console.log(date, req.method, url.pathname);
        
        const route = url.pathname
        const handler = this.routes.get(route)
        if (handler) {
            return handler(req)
        }
        return new Promise(() => new Response('Not Found', { status: 404 }))
    }

    addFileRoute(route: string, path: string) {
        this.addRoute(route, async (req: Request) => {
            const url = new URL(req.url)
            const filePath = url.pathname.replace(route, path)
            const file = Bun.file(filePath)
            return new Response(file, { status: 200 })
        })
    }

    addFavIcon(route: string, path: string) {
        this.addRoute(route, async (req: Request) => {
            const url = new URL(req.url)
            const filePath = url.pathname.replace(route, path)
            const file = Bun.file(filePath)
            const res =  new Response(file, { status: 200 })
            res.headers.set('Content-Type', 'image/x-icon')
            return res
        })
    }

    async useDirectory(route: string, path: string) {
        const filesname = await readdir(path)
        for (const filename of filesname) {
            // remove not css, js, html files
            if (!filename.match(/.*\.(css|js|html|ttf)/)) continue
            const filePath = path + filename
            const fileRoute = route + filename
            this.addFileRoute(fileRoute, filePath)

            // if file is index.html, add route without index.html
            if (filename === 'index.html') {
                const indexRoute = fileRoute.replace('index.html', '')
                this.addFileRoute(indexRoute, filePath)
            }
        }
    }
}