import { clearDatabase, createQuiz, getQuiz, getQuizzes } from "./src/API/APIQuiz";
import { setAPIRoute } from "./src/API/APIRouter";
import { Router } from "./src/Router";

const router = new Router();

setAPIRoute(router);

// Quiz Master
router.useDirectoryRecursive('/', './public/quizMaster/');
router.addFavIcon('/favicon.ico', './public/quizMaster/favicon.ico');


Bun.serve({
  async fetch(req) {
    const res = await router.fetch(req);
    return res;
  },
  error(e) {
    console.error(e);
    return new Response("Internal Server Error", { status: 500 });
  }
});

console.log("Server started at http://localhost:3000");
