import { clearDatabase, createQuiz, getQuiz, getQuizzes } from "./src/API";
import { Router } from "./src/Router";

const router = new Router();

router.addRoute('/getQuiz', getQuiz);
router.addRoute('/getQuizzes', getQuizzes);
router.addRoute('/clear', clearDatabase);
router.addRoute('/createQuiz', createQuiz);

Bun.serve({
  async fetch(req) {
    const res = await router.fetch(req);
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "*");
    res.headers.set("Access-Control-Allow-Headers", "*");
    res.headers.set("Access-Control-Allow-Credentials", "true");
    return res;
  },
  error(e) {
    console.error(e);
    return new Response("Internal Server Error", { status: 500 });
  }
});

console.log("Server started at http://localhost:3000");
