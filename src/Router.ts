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
}